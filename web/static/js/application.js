import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { browserHistory, Router, Route } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import configureStore from './redux/store';
import ProjectContainer from './containers/ProjectContainer';
import SettingsContainer from './containers/SettingsContainer';
import { getSettings, updateSettings } from './utils/settings';
import $ from 'jquery';
import _ from 'lodash';

const settingsPath = 'settings';

const checkConfig = (nextState, replaceState) => (
  _.isEmpty(getSettings) ? replaceState(null, settingsPath) : null
);

const handleGitHubAuth = (nextState, replaceState, callback) => {
  let { code, state } = nextState.location.query;
  let expectedState = getSettings().state;
  if (state === expectedState) {
    $.ajax({
      url: `${process.env.HOST}/authorize_github?code=${code}`,
      method: 'POST',
      dataType: 'json'
    }).success(data =>
      console.log(data)
    ).fail(data => { // TODO: Not sure why this is failing
      updateSettings({ gitHubToken: data.responseText });
      callback(replaceState(null, settingsPath));
    });
  }
  updateSettings({ state: null });
};

const handleHerokuAuth = (nextState, replaceState, callback) => {
  let { code, state } = nextState.location.query;
  let expectedState = getSettings().state;
  if (state === expectedState) {
    $.ajax({
      url: `${process.env.HOST}/authorize_heroku?code=${code}`,
      method: 'POST',
      dataType: 'json'
    }).success(data => {
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
        <Route path='/' component={ProjectContainer} onEnter={checkConfig} />
        <Route path='settings' component={SettingsContainer} />
        <Route path='github_authorized' onEnter={handleGitHubAuth} />
        <Route path='heroku_authorized' onEnter={handleHerokuAuth} />
      </Router>
    </Provider>);

ReactDOM.render(node, target);
