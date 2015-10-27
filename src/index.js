import React from 'react';
import { Router, Route } from 'react-router';
import ProjectContainer from './containers/ProjectContainer';

React.render(
  <Router>
    <Route path='/' component={ProjectContainer} />
  </Router>, document.getElementById('root')
);
