import React from 'react';
import { connect } from 'react-redux';

import AlertBox from '../../common/components/AlertBox';
import LoadingIndicator from '../../common/components/LoadingIndicator';

import { closeAlert } from '../actions/alert.js';
import { closeDisclaimer } from '../actions/disclaimer';
import { loadPrescriptions } from '../actions/prescriptions';
import Disclaimer from '../components/Disclaimer';
import ErrorView from '../components/ErrorView';
import SettingsButton from '../components/SettingsButton';
import TabNav from '../components/TabNav';

class Main extends React.Component {
  componentDidMount() {
    this.props.loadPrescriptions();
  }

  render() {
    const { loading, prescriptions } = this.props;

    if (loading) {
      return <LoadingIndicator message="Loading your prescriptions..."/>;
    }

    if (!prescriptions) {
      const content = (
        <div>
          <h4>No active VA prescriptions </h4>
          <div>
            It looks like you don't have any active VA prescriptions. If you're taking a medicine that you don't see listed here—or if you have any questions about your current medicines—please contact your VA health care team. If you need more help, please call the Vets.gov Help Desk at 1-855-574-7286 (TTY: 1-800-829-4833). We’re here Monday - Friday, 8:00 a.m. - 8:00 p.m. (ET).
          </div>
        </div>
      );

      return (
        <div>
          <div className="rx-app-title">
            <h1>Prescription Refill</h1>
          </div>
          <AlertBox
            content={content}
            isVisible
            status="warning"/>
        </div>
      );
    }

    return (
      <ErrorView errors={this.props.errors}>
        <AlertBox
          content={this.props.alert.content}
          isVisible={this.props.alert.visible}
          onCloseAlert={this.props.closeAlert}
          scrollOnShow
          status={this.props.alert.status}/>
        <Disclaimer
          isOpen={this.props.disclaimer.open}
          handleClose={this.props.closeDisclaimer}/>
        <div className="rx-app-title">
          <h1>Prescription Refill</h1>
          <SettingsButton/>
        </div>
        <TabNav/>
        {this.props.children}
      </ErrorView>
    );
  }
}

const mapStateToProps = (state) => {
  const rxState = state.health.rx;
  const { alert, disclaimer, errors, prescriptions } = rxState;
  const { items, loading } = prescriptions.history;
  return {
    alert,
    disclaimer,
    errors,
    loading,
    prescriptions: items
  };
};

const mapDispatchToProps = {
  closeAlert,
  closeDisclaimer,
  loadPrescriptions,
};

export default connect(mapStateToProps, mapDispatchToProps)(Main);
