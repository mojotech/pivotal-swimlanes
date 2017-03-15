import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { browserHistory, Router, Route } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import configureStore from './redux/store';

import AuthenticatedContainer from './containers/AuthenticatedContainer';
import ProjectContainer from './containers/ProjectContainer';
import RegistrationContainer from './containers/RegistrationContainer';
import SessionContainer from './containers/SessionContainer';
import SettingsContainer from './containers/SettingsContainer';
import { getSettings, updateSettings } from './utils/settings';
import { refreshCurrentUser } from './redux/actions/session';
import $ from 'jquery';

const settingsPath = 'settings';
const loginPath = 'login';

const ensureAuthenticated = (nextState, replace, callback) => {
  const { dispatch } = store;
  const { session } = store.getState();
  const { currentUser } = session;

  if (!currentUser && localStorage.getItem('swimlanesAuthToken')) {
    dispatch(refreshCurrentUser());
  } else if (!localStorage.getItem('swimlanesAuthToken')) {
    replace(loginPath);
  }

  callback();
};

const handleGitHubAuth = (nextState, replaceState, callback) => {
  let { code, state } = nextState.location.query;
  let expectedState = getSettings.state;
  if (state === expectedState) {
    $.ajax({
      url: `${process.env.HOST}/authorize_github?code=${code}`,
      method: 'POST',
      dataType: 'json'
    }).done(data =>
      console.log(data.responseText)
    ).fail(data => { // TODO: Not sure why this is failing
      updateSettings({ gitHubToken: data.responseText });
      callback(replaceState(null, settingsPath));
    });
  }
  updateSettings({ state: null });
};

const handleHerokuAuth = (nextState, replaceState, callback) => {
  let { code, state } = nextState.location.query;
  let expectedState = getSettings.state;
  if (state === expectedState) {
    $.ajax({
      url: `${process.env.HOST}/authorize_heroku?code=${code}`,
      method: 'POST',
      dataType: 'json'
    }).done(data => {
      updateSettings({ herokuToken: data.access_token });
      callback(replaceState(null, settingsPath));
    });
  }
  updateSettings({ state: null });
};

const store = configureStore(browserHistory);
const history = syncHistoryWithStore(browserHistory, store);
const target = document.getElementById('root');
const node =
  (<Provider store={store}>
      <Router history={history}>
        <Route path='sign_up' component={RegistrationContainer} />
        <Route path='login' component={SessionContainer} />
        <Route path='/' component={AuthenticatedContainer} onEnter={ensureAuthenticated}>
          <Route path='projects' component={ProjectContainer} />
          <Route path='settings' component={SettingsContainer} />
        </Route>
        <Route path='github_authorized' onEnter={handleGitHubAuth} />
        <Route path='heroku_authorized' onEnter={handleHerokuAuth} />
      </Router>
    </Provider>);

ReactDOM.render(node, target);
