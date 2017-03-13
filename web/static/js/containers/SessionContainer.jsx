import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import FlatButton from 'material-ui/FlatButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import HeaderBar from '../components/Project/HeaderBar';

import * as sessionActions from '../redux/actions/session';
import { renderErrorsFor } from '../utils/errors';

class SessionContainer extends React.Component {
  static propTypes = {
    loginUser: PropTypes.func.isRequired
  };

  handleSubmit(e) {
    e.preventDefault();
    const { email, password } = this.refs;

    this.props.loginUser(email.value, password.value);
  }

  render() {
    const { errors } = this.props;

    return (
      <div>
        <HeaderBar
          heading='Log In'
          sidebarVisible={false}
          showFilter={false}
          showSettings={false} />
        <div className='sign-reg-wrapper'>
          <form id='sign-in-form' className='sign-reg-form' onSubmit={(e) => this.handleSubmit(e)}>
            <div className='field'>
              <label htmlFor='email'>Email</label>
              <input
                id='user-email'
                className='input'
                ref='email' type='Email'
                placeholder='Email'
                required='true' />
              {renderErrorsFor(errors, 'email')}
            </div>

            <div className='field'>
              <label htmlFor='password'>Password</label>
              <input
                id='user-password'
                className='input'
                ref='password'
                type='password'
                placeholder='Password'
                required='true' />
              {renderErrorsFor(errors, 'password')}
            </div>
            <div className='field'>
              <MuiThemeProvider>
                <FlatButton
                  label='Log In'
                  type='submit'
                  backgroundColor='#0094D9'
                  labelStyle={{color:'#FFFFFF' }} />
              </MuiThemeProvider>
            </div>
            <Link to='/sign_up' className='sign-link'>
              Need account? Register here....
            </Link>
          </form>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => (state.session);

const mapDispatchToProps = dispatch => ({
  loginUser: (email, password) => dispatch(sessionActions.login(email, password))
})

export default connect(mapStateToProps, mapDispatchToProps)(SessionContainer);
