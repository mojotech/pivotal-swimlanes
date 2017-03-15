import { Socket } from 'phoenix';
import { httpGet, httpPost, httpPatch, httpDelete } from '../../utils/api-fetch';
import { push } from 'react-router-redux';

export const CURRENT_USER = 'CURRENT_USER';
export const SESSION_ERROR = 'SESSION_ERROR';
export const USER_LOGGED_OUT = 'USER_LOGGED_OUT';
export const SET_USER_DATA = 'SET_USER_DATA';
export const SET_FIELD = 'SET_FIELD';
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

export const login = (email, password) => (
  (dispatch) => {
    const data = {
      session: {
        email: email,
        password: password
      }
    };

    httpPost('/api/sessions', data)
    .then((resp) => {
      localStorage.setItem('swimlanesAuthToken', resp.jwt);
      dispatch(setCurrentUser(resp.user));
      dispatch(setUserSocket(resp.user));
      dispatch(push('/projects'));
    })
    .catch((error) => {
      if (error.response) {
        error.response.json()
        .then((errorJSON) => {
          dispatch(sessionError(errorJSON.error));
        });
      }
    });
  }
);

export const setData = () => (
  (dispatch, getState) => {
    const { currentUser } = getState().session;

    dispatch({
      type: SET_USER_DATA,
      userData: {
        first_name: currentUser.firstName,
        last_name: currentUser.lastName,
        email: currentUser.email,
        github_token: currentUser.githubToken,
        pivotal_token: currentUser.pivotalToken,
        pivotal_project_id: currentUser.pivotalProjectId
      }
    });
  }
);
export const setField = (field, value) => (
  (dispatch) => {
    dispatch({
      type: SET_FIELD,
      field,
      value
    });
  }
);

export const update = (id) => (
  (dispatch, getState) => {
    const { userData } = getState().session;
    httpPatch(`/api/current_user/${id}`, { id: id, user: userData })
    .then((data) => {
      dispatch(setCurrentUser(data));
    })
    .catch((error) => {
      console.log(error);
    });
  }
);

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

export const logout = () => (
  (dispatch) => {
    httpDelete('/api/sessions')
    .then(() => {
      localStorage.removeItem('swimlanesAuthToken');
      dispatch(logOutUser());
      dispatch(push('/login'));
    })
    .catch((error) => {
      if (error.response) {
        error.response.json()
        .then((errorJSON) => {
          dispatch(sessionError(errorJSON.error));
        });
      }
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

const logOutUser = () => ({ type: USER_LOGGED_OUT });

const sessionError = (error) => ({ type: SESSION_ERROR, error });
