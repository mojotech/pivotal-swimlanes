//used to set track session state.
//Consists of the currentUser object which we will set after authenticating visitors,
//the socket that we will use for connecting to channels
//error to keep track of any issue while authenticating the user.
import * as actions from '../actions/session';

const defaultState = {
  currentUser: null,
  userData: {},
  socket: null,
  channel: null,
  regErrors: null,
  error: null
};

export default (state = defaultState, action) => {
  switch (action.type) {
  case actions.CURRENT_USER:
    return { ...state, currentUser: action.currentUser, error: '' };

  case actions.SET_USER_DATA:
    return { ...state, userData: action.userData};

  case actions.SET_FIELD:
    return { ...state, userData: { ...state.userData, [action.field]: action.value } };

  case actions.SOCKET_CONNECTED:
    return { ...state, socket: action.socket, channel: action.channel };

  case actions.USER_LOGGED_OUT:
    return defaultState;

  case actions.SESSION_ERROR:
    return { ...state, error: action.error };

  case actions.REGISTRATION_ERROR:
    return { ...state, regErrors: action.errors };

  default:
    return state;
  }
};
