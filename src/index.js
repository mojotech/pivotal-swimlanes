import React from 'react';
import { Router, Route } from 'react-router';
import history from './history';
import ProjectContainer from './containers/ProjectContainer';
import SetupContainer from './containers/SetupContainer';

function checkConfig(nextState, replaceState) {
  if (!localStorage.getItem('pivotal-swimlanes-config')) {
    replaceState(null, '/setup');
  }
}

React.render(
  <Router history={history}>
    <Route path='/' component={ProjectContainer} onEnter={checkConfig} />
    <Route path='setup' component={SetupContainer} />
  </Router>, document.getElementById('root')
);
