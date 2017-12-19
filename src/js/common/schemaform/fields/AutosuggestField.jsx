import React from 'react';
import _ from 'lodash/fp';
import Autosuggest from 'react-autosuggest-ie11-compatible';
import { sortListByFuzzyMatch } from '../../utils/helpers';

export default class AutosuggestField extends React.Component {
  constructor(props) {
    super(props);
    const input = props.formData ? (props.formData.label || '') : '';
    const uiOptions = this.props.uiSchema['ui:options'];

    let options = [];
    let suggestions = [];

    if (!uiOptions.getOptions) {
      this.useEnum = true;
      options = props.schema.enum.map((id, index) => {
        return {
          id,
          label: uiOptions.labels[id] || props.schema.enumNames[index]
        };
      });
      suggestions = this.getSuggestions(options, input);
    }

    this.state = {
      options,
      input,
      suggestions
    };

  }

  componentDidMount() {
    if (!this.props.formContext.reviewMode) {
      const uiOptions = this.props.uiSchema['ui:options'];
      if (uiOptions.getOptions) {
        uiOptions.getOptions().then(options => {
          if (!this.unmounted) {
            this.setState({ options, suggestions: this.getSuggestions(options, this.state.input) });
          }
        });
      }
    }
  }

  componentWillUnmount() {
    this.unmounted = true;
  }

  onChange = (event, { newValue }) => {
    this.setState({ input: newValue });
    if (!newValue) {
      this.props.onChange();
    }
  }

  getSuggestions = (options, value) => {
    if (value) {
      const uiOptions = this.props.uiSchema['ui:options'];
      return sortListByFuzzyMatch(value, options).slice(0, uiOptions.maxOptions);
    }

    return options;
  }

  getFormData = (suggestion) => {
    if (this.useEnum) {
      return suggestion.id;
    }

    return _.set('widget', 'autosuggest', suggestion);
  }

  getReviewLabel(formData, uiSchema, schema) {
    const uiOptions = uiSchema['ui:options'];
    if (!uiOptions.getOptions) {
      if (uiOptions.labels[formData]) {
        return uiOptions.labels[formData];
      }

      const index = schema.enum.indexOf(formData) >= 0;
      if (schema.enumNames && index >= 0) {
        return uiOptions.labels[formData] || schema.enumNames[index];
      }

      return null;
    }

    return formData.label;
  }

  handleSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      input: value,
      suggestions: this.getSuggestions(this.state.options, value)
    });
  }

  handleSuggestionSelected = (event, { suggestion }) => {
    event.preventDefault();
    if (suggestion) {
      this.props.onChange(this.getFormData(suggestion));
    } else {
      this.props.onChange();
    }
    this.setState({ input: suggestion.label });
  }

  handleBlur = () => {
    const value = this.getReviewLabel(this.props.formData, this.props.uiSchema, this.props.schema) || '';
    if (!value && this.state.input) {
      this.props.onChange(this.state.input);
    } else if (!value) {
      this.props.onChange();
    }
    this.props.onBlur(this.props.idSchema.$id);
  }

  handleSuggestionsClearRequested = () => {
    this.setState({ suggestions: [] });
  }

  shouldRenderSuggestions(searchTerm) {
    const checkLength = searchTerm.trim().length > 2;
    return checkLength;
  }

  renderSuggestion(suggestion) {
    return <div>{suggestion.label}</div>;
  }

  render() {
    const { idSchema, formContext, formData, uiSchema, schema } = this.props;
    const id = idSchema.$id;

    if (formContext.reviewMode) {
      return (
        <div className="review-row">
          <dt>{this.props.uiSchema['ui:title']}</dt>
          <dd><span>{this.getReviewLabel(formData, uiSchema, schema)}</span></dd>
        </div>
      );
    }

    return (
      <Autosuggest
        getSuggestionValue={suggestion => suggestion.label}
        highlightFirstSuggestion
        onSuggestionsClearRequested={this.handleSuggestionsClearRequested}
        onSuggestionSelected={this.handleSuggestionSelected}
        onSuggestionsFetchRequested={this.handleSuggestionsFetchRequested}
        renderSuggestion={this.renderSuggestion}
        shouldRenderSuggestions={this.shouldRenderSuggestions}
        suggestions={this.state.suggestions}
        inputProps={{
          id,
          name: id,
          value: this.state.input,
          onChange: this.onChange,
          'aria-labelledby': `${id}-label`,
          onBlur: this.handleBlur
        }}/>
    );
  }
}
