import React, { PropTypes }   from 'react';
import { connect }          from 'react-redux';
import { Link }             from 'react-router';
import FlatButton from 'material-ui/FlatButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import { renderErrorsFor } from '../utils/errors';
import * as sessionActions from '../redux/actions/session';

import HeaderBar from '../components/Project/HeaderBar';

class RegistrationContainer extends React.Component {
  static propTypes = {
    registerUser: PropTypes.func.isRequired
  };

  handleSubmit(e) {
    e.preventDefault();

    const data = {
      first_name: this.refs.firstName.value,
      last_name: this.refs.lastName.value,
      email: this.refs.email.value,
      password: this.refs.password.value,
      password_confirmation: this.refs.passwordConfirmation.value,
    };

    this.props.registerUser(data);
  }

  render() {
    const { errors } = this.props;

    return (
      <div>
        <HeaderBar
          heading='Sign Up'
          sidebarVisible={false}
          showFilter={false}
          showSettings={false} />
        <div className='sign-reg-wrapper'>
          <form id='sign-up-form' className='sign-reg-form' onSubmit={(e) => this.handleSubmit(e)}>
            <div className='field'>
              <label htmlFor='first_name'>First name</label>
              <input className='input' ref='firstName' id='user-first-name' type='text' placeholder='First Name' required={true} />
              {renderErrorsFor(errors, 'first_name')}
            </div>
            <div className='field'>
              <label htmlFor='last_name'>Last name</label>
              <input className='input' ref='lastName' id='user-last-name' type='text' placeholder='Last Name' required={true} />
              {renderErrorsFor(errors, 'last_name')}
            </div>
            <div className='field'>
              <label htmlFor='email'>Email</label>
              <input className='input' ref='email' id='user-email' type='email' placeholder='Email' required={true} />
              {renderErrorsFor(errors, 'email')}
            </div>
            <div className='field'>
              <label htmlFor='password'>Password</label>
              <input className='input' ref='password' id='user-password' type='password' placeholder='Password' required={true} />
              {renderErrorsFor(errors, 'password')}
            </div>
            <div className='field'>
              <label htmlFor='password_confirmation'>Password Confirmation</label>
              <input className='input' ref='passwordConfirmation' id='user-password-confirmation' type='password' placeholder='Confirm Password' required={true} />
              {renderErrorsFor(errors, 'password_confirmation')}
            </div>
            <div className='field'>
              <MuiThemeProvider>
                <FlatButton
                  label='Sign Up'
                  type='submit'
                  backgroundColor='#0094D9'
                  labelStyle={{color:'#FFFFFF' }} />
              </MuiThemeProvider>
            </div>
            <Link to='/login' className='sign-link'>Have an account? Log In</Link>
          </form>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ session }) => ({
  errors: session.regErrors,
});

const mapDispatchToProps = dispatch => ({
  registerUser: (data) => dispatch(sessionActions.signUp(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(RegistrationContainer);
