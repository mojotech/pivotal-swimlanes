import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route } from 'react-router';
import history from './history';
import ProjectContainer from './containers/ProjectContainer';
import SettingsContainer from './containers/SettingsContainer';
import $ from 'jquery';
import _ from 'lodash';

const localStorageKey = 'pivotal-swimlanes-config';

const settingsPath = 'settings';

const settings = () => JSON.parse(localStorage.getItem(localStorageKey)) || {};

const updateSettings = data => (
  localStorage.setItem(localStorageKey, JSON.stringify({ ...settings(), ...data }))
);

const checkConfig = (nextState, replaceState) => (
  _.isEmpty(settings()) ? replaceState(null, settingsPath) : null
);

const handleGitHubAuth = (nextState, replaceState, callback) => {
  let { code } = nextState.location.query;

  // TODO: abort if nextState.location.query.state doesn't match what it expects

  $.ajax({
    url: `http://localhost:3000/authorize_github?code=${code}`,
    method: 'POST',
    dataType: 'json'
  }).success(data =>
    console.log(data)
  ).fail(data => { // TODO: Not sure why this is failing
    updateSettings({ gitHubToken: data.responseText });
    callback(replaceState(null, settingsPath));
  });
};

const handleHerokuAuth = (nextState, replaceState, callback) => {
  let { code } = nextState.location.query;

  // TODO: abort if nextState.location.query.state doesn't match what it expects

  $.ajax({
    url: `http://localhost:3000/authorize_heroku?code=${code}`,
    method: 'POST',
    dataType: 'json'
  }).success(data => {
    updateSettings({ herokuToken: data.access_token });
    callback(replaceState(null, settingsPath));
  });
};

ReactDOM.render(
  <Router history={history}>
    <Route path='/' component={ProjectContainer} onEnter={checkConfig} />
    <Route path='settings' component={SettingsContainer} />
    <Route path='github_authorized' onEnter={handleGitHubAuth} />
    <Route path='heroku_authorized' onEnter={handleHerokuAuth} />
  </Router>, document.getElementById('root')
);
