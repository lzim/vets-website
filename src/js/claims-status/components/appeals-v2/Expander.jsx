import React from 'react';
import PropTypes from 'prop-types';

const missingEventsAlert = (
  <div className="usa-alert usa-alert-warning">
    <div className="usa-alert-body">
      <h4 className="usa-alert-heading">Missing events</h4>
      <p className="usa-alert-text">There may be some events missing from this page. If you have questions about a past form or VA decision, please contact your VSO or representative for more information.</p>
    </div>
  </div>
);

const Expander = ({ expanded, dateRange, onToggle, missingEvents }) => {
  const title = expanded ? 'Hide past events' : 'See past events';
  const cssClass = expanded ? 'section-expanded' : 'section-unexpanded';
  const separator = (expanded && !missingEvents) ?  <div className="separator"/> : null;
  const alert = (expanded && missingEvents) ? missingEventsAlert : null;

  return (
    <li className={`process-step ${cssClass}`}>
      {/* Giving this a margin top to help center the text to the li bullet */}
      <button onClick={onToggle} className="va-button-link">
        <h3 style={{ color: 'inherit' }}>{title}</h3>
      </button>
      <div className="appeal-event-date">{dateRange}</div>
      {alert}
      {separator}
    </li>
  );
};

Expander.propTypes = {
  expanded: PropTypes.bool.isRequired,
  missingEvents: PropTypes.bool.isRequired,
  dateRange: PropTypes.string.isRequired,
  onToggle: PropTypes.func.isRequired,
  cssClass: PropTypes.string.isRequired,
};

export default Expander;
