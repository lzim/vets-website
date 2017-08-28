import React from 'react';
import { expect } from 'chai';
import ReactTestUtils from 'react-dom/test-utils';

import { DefinitionTester, getFormDOM } from '../../../util/schemaform-utils.jsx';
import formConfig from '../../../../src/js/edu-benefits/1990-rjsf/config/form';

describe('Edu 1990 employmentHistory', () => {
  const { schema, uiSchema } = formConfig.chapters.employmentHistory.pages.employmentHistory;
  const definitions = formConfig.defaultDefinitions;
  it('should render', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        schema={schema}
        data={{}}
        uiSchema={uiSchema}
        definitions={definitions}/>
    );

    const formDOM = getFormDOM(form);

    expect(formDOM.querySelectorAll('input,select').length).to.equal(2);
  });
  it('should show history fields', () => {
    const form = ReactTestUtils.renderIntoDocument(
      <DefinitionTester
        schema={schema}
        data={{}}
        uiSchema={uiSchema}
        definitions={definitions}/>
    );

    const formDOM = getFormDOM(form);

    formDOM.setYesNo('#root_view\\:hasNonMilitaryJobsYes', 'Y');

    expect(formDOM.querySelectorAll('input,select').length).to.equal(7);
  });
});
