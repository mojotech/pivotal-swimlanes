import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route } from 'react-router';
import history from './history';
import ProjectContainer from './containers/ProjectContainer';
import SettingsContainer from './containers/SettingsContainer';
import $ from 'jquery';

function checkConfig(nextState, replaceState) {
  if (!localStorage.getItem('pivotal-swimlanes-config')) {
    replaceState(null, '/settings');
  }
}

function handleGitHubAuth(nextState, replaceState, callback) {
  let { code, state } = nextState.location.query;

  // TODO: abort if state doesn't match what it expects

  $.ajax({
    url: `http://localhost:3000/authorize_github?code=${code}`,
    method: 'POST',
    dataType: 'json'
  }).success(data =>
    console.log(data)
  ).fail(data => { // TODO: Not sure why this is failing
    let gitHubToken = data.responseText;
    let {
      pivotalToken,
      pivotalProjectId,
      gitHubUser,
      gitHubRepo,
      herokuToken
    } = JSON.parse(localStorage.getItem('pivotal-swimlanes-config')) || {};
    localStorage.setItem(
      'pivotal-swimlanes-config',
      JSON.stringify({
        pivotalToken,
        pivotalProjectId,
        gitHubUser,
        gitHubRepo,
        gitHubToken,
        herokuToken
      })
    );
    callback(replaceState(null, 'settings'));
  });
}

function handleHerokuAuth(nextState, replaceState, callback) {
  let { code, state } = nextState.location.query;

  // TODO: abort if state doesn't match what it expects

  $.ajax({
    url: `http://localhost:3000/authorize_heroku?code=${code}`,
    method: 'POST',
    dataType: 'json'
  }).success(data => {
    var herokuToken = data.access_token;
    let {
      pivotalToken,
      pivotalProjectId,
      gitHubUser,
      gitHubRepo,
      gitHubToken
    } = JSON.parse(localStorage.getItem('pivotal-swimlanes-config')) || {};
    localStorage.setItem(
      'pivotal-swimlanes-config',
      JSON.stringify({
        pivotalToken,
        pivotalProjectId,
        gitHubUser,
        gitHubRepo,
        gitHubToken,
        herokuToken
      })
    );
    callback(replaceState(null, 'settings'));
  });
}

ReactDOM.render(
  <Router history={history}>
    <Route path='/' component={ProjectContainer} onEnter={checkConfig} />
    <Route path='settings' component={SettingsContainer} />
    <Route path='github_authorized' onEnter={handleGitHubAuth} />
    <Route path='heroku_authorized' onEnter={handleHerokuAuth} />
  </Router>, document.getElementById('root')
);
