import React from 'react';
import { connect } from 'react-redux';

import Main from '../../../signin/containers/Main';
import Modal from '../Modal';
import { toggleLoginOverlay } from '../../../login/actions';

class LoginContainer extends React.Component {
  render() {
    const { showOverlay } = this.props;

    return (
      <div>
        {this.props.children}
        <Modal cssClass="va-modal-large" visible={showOverlay} onClose={() => this.props.toggleLoginOverlay(false)}>
          <Main onLoggedIn={() => this.props.toggleLoginOverlay(false)}/>
        </Modal>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    showOverlay: state.user.login.showOverlay
  };
}

const mapDispatchToProps = {
  toggleLoginOverlay
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginContainer);
