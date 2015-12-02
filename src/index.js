import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route } from 'react-router';
import history from './history';
import ProjectContainer from './containers/ProjectContainer';
import SettingsContainer from './containers/SettingsContainer';
import { getSettings, updateSettings } from './settings';
import $ from 'jquery';
import _ from 'lodash';

const settingsPath = 'settings';

const checkConfig = (nextState, replaceState) => (
  _.isEmpty(getSettings()) ? replaceState(null, settingsPath) : null
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

ReactDOM.render(
  <Router history={history}>
    <Route path='/' component={ProjectContainer} onEnter={checkConfig} />
    <Route path='settings' component={SettingsContainer} />
    <Route path='github_authorized' onEnter={handleGitHubAuth} />
    <Route path='heroku_authorized' onEnter={handleHerokuAuth} />
  </Router>, document.getElementById('root')
);
