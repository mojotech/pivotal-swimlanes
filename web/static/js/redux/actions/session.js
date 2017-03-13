import { Socket } from 'phoenix';
import { httpGet, httpPost, httpDelete } from '../../utils/api-fetch';
import { push } from 'react-router-redux';

export const CURRENT_USER = 'CURRENT_USER';
export const SESSION_ERROR = 'SESSION_ERROR';
export const SOCKET_CONNECTED = 'SOCKET_CONNECTED';
export const REGISTRATION_ERROR = 'REGISTRATION_ERROR';

export const signUp = (data) => {
  return dispatch => {
    httpPost('/api/registrations', { user: data })
    .then((resp) => {
      localStorage.setItem('swimlanesAuthToken', resp.jwt);
      dispatch(setCurrentUser(resp.user));
      dispatch(setUserSocket(resp.user));
      dispatch(push('/settings'));
    })
    .catch((error) => {
      if (error.response) {
        error.response.json()
        .then((errorJSON) => {
          dispatch({
            type: REGISTRATION_ERROR,
            errors: errorJSON.errors
          });
        });
      }
    });
  };
};

const setUserSocket = (user) => (
  (dispatch) => {
    const socket = new Socket('/socket', {
      params: { token: localStorage.getItem('swimlanesAuthToken') }
    });

    socket.connect();

    const channel = socket.channel(`users:${user.id}`);

    channel.join().receive('ok', () => {
      dispatch(connectSocket(socket, channel));
    });
  }
);

const setCurrentUser = (user) => (
  {
    type: CURRENT_USER,
    currentUser: user
  }
);

const connectSocket = (socket, channel) => (
  {
    type: SOCKET_CONNECTED,
    socket,
    channel
  }
);

const sessionError = (error) => ({ type: SESSION_ERROR, error });
