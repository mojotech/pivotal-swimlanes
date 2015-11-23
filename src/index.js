import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route } from 'react-router';
import history from './history';
import ProjectContainer from './containers/ProjectContainer';
import SetupContainer from './containers/SetupContainer';
import $ from 'jquery';

function checkConfig(nextState, replaceState) {
  if (!localStorage.getItem('pivotal-swimlanes-config')) {
    replaceState(null, '/setup');
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
      gitHubRepo
    } = JSON.parse(localStorage.getItem('pivotal-swimlanes-config')) || {};
    localStorage.setItem(
      'pivotal-swimlanes-config',
      JSON.stringify({
        pivotalToken,
        pivotalProjectId,
        gitHubUser,
        gitHubRepo,
        gitHubToken
      })
    );
    callback(replaceState(null, 'setup'));
  });
}

ReactDOM.render(
  <Router history={history}>
    <Route path='/' component={ProjectContainer} onEnter={checkConfig} />
    <Route path='setup' component={SetupContainer} />
    <Route path='github_authorized' onEnter={handleGitHubAuth} />
  </Router>, document.getElementById('root')
);
