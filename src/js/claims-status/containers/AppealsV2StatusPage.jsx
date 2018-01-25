import React from 'react';
import PropTypes from 'prop-types';

import { getStatusContents, getNextEvents, EVENT_TYPES } from '../utils/appeals-v2-helpers';

import Timeline from '../components/appeals-v2/Timeline';
import CurrentStatus from '../components/appeals-v2/CurrentStatus';
import Alerts from '../components/appeals-v2/Alerts';
import WhatsNext from '../components/appeals-v2/WhatsNext';
import Docket from '../components/appeals-v2/Docket';

/**
 * AppealsV2StatusPage is in charge of the layout of the status page
 */
const AppealsV2StatusPage = ({ appeal }) => {
  const { events, alerts, status, docket } = appeal.attributes;
  const { type, details } = status;
  const currentStatus = getStatusContents(type, details);
  const nextEvents = getNextEvents(type);
  const form9Date = events.find(e => e.type === EVENT_TYPES.form9, null);
  return (
    <div>
      <Timeline events={events}/>
      <CurrentStatus
        title={currentStatus.title}
        description={currentStatus.description}/>
      <Alerts alerts={alerts}/>
      <WhatsNext nextEvents={nextEvents}/>
      <Docket {...docket}/>
    </div>
  );
};

AppealsV2StatusPage.propTypes = {
  appeal: PropTypes.shape({
    attributes: PropTypes.shape({
      events: PropTypes.array,
      alerts: PropTypes.array,
      status: PropTypes.shape({
        type: PropTypes.string,
        details: PropTypes.object,
      }).isRequired
    }).isRequired,
  })
};

export default AppealsV2StatusPage;
