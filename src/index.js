import React from 'react';
import App from './components/App';
import { PIVOTAL_TOKEN, PIVOTAL_PROJECT_ID, GITHUB_TOKEN } from './.env';

React.render(
  <App
    pivotalToken={PIVOTAL_TOKEN}
    pivotalProjectId={PIVOTAL_PROJECT_ID}
    gitHubToken={GITHUB_TOKEN} />,
  document.getElementById('root')
);
