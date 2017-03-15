import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import * as Actions from '../redux/actions/session';

class AuthenticatedContainer extends Component {
  static propTypes = {
    currentUser: PropTypes.object
  };

  render() {
    const { currentUser } = this.props;
    if (!currentUser) return false;

    return (
      <div id="authentication-container" className="application-container">

        <div className='main-container'>
          {this.props.children}
        </div>
      </div>
    );
  }
};

const mapStateToProps = ({ session }) => ({
  currentUser: session.currentUser
});

export default connect(mapStateToProps)(AuthenticatedContainer);
