import PropTypes from 'prop-types';
import React from 'react';

import SystemDownView from '../../common/components/SystemDownView';

class RequiredVeteranView extends React.Component {

  render() {
    let view;
    const serviceAvailable = this.props.userProfile.services.indexOf('id-card') !== -1;
    const serviceRateLimited = Math.random() > 0.75;

    if (this.props.userProfile.veteranStatus === 'SERVER_ERROR') {
      // If eMIS status is null, show a system down message.
      view = <SystemDownView messageLine1="We’re sorry. We can’t proceed with your request for a Veteran ID card because we can't confirm your military history right now. Please try again in a few minutes." messageLine2="If it still doesn’t work, please call the Vets.gov Help Desk at 1-855-574-7286, TTY: 1-800-877-8339. We’re here Monday &#8211; Friday, 8:00 a.m. &#8211; 8:00 p.m. (ET)."/>;
    } else if (this.props.userProfile.veteranStatus === 'NOT_FOUND') {
      // If eMIS status is "not found", show message that we cannot find the user
      // in our system.
      view = <SystemDownView messageLine1="We’re sorry. We can’t proceed with your request for a Veteran ID card because we can't confirm your military history right now. Please try again in a few minutes." messageLine2="If it still doesn’t work, please call the Vets.gov Help Desk at 1-855-574-7286, TTY: 1-800-877-8339. We’re here Monday &#8211; Friday, 8:00 a.m. &#8211; 8:00 p.m. (ET)."/>;
    } else if (this.props.userProfile.veteranStatus === 'OK') {
      if (serviceRateLimited) {
        view = <SystemDownView messageLine1="We can't proceed with your request for a Veteran ID Card." messageLine2="We're sorry, this service is currently under heavy load. We're actively addressing the issues, please try again later."/>;
      } else if (!serviceAvailable) {
        // If all above conditions are true and service is still not present in user profile, then user
        // is either not enrolled in beta, or is not eligible on other grounds
        // such as discharge status.
        view = <SystemDownView messageLine1="We can't proceed with your request for a Veteran ID Card." messageLine2="We’re working to expand the program to all eligible Veterans, so please check back again soon to see if you’re eligible."/>;
      } else {
        view = this.props.children;
      }
    }

    return (
      <div>
        {view}
      </div>
    );
  }
}

RequiredVeteranView.propTypes = {
  userProfile: PropTypes.object.isRequired,
};

export default RequiredVeteranView;
