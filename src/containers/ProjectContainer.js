import React from 'react';
import Project from '../components/Project';
import {
  PIVOTAL_TOKEN,
  PIVOTAL_PROJECT_ID,
  GITHUB_TOKEN,
  GITHUB_USER,
  GITHUB_REPO
} from '../.env';

const ProjectContainer = React.createClass({
  render() {
    return (
      <Project
        pivotalToken={PIVOTAL_TOKEN}
        pivotalProjectId={PIVOTAL_PROJECT_ID}
        gitHubToken={GITHUB_TOKEN}
        gitHubUser={GITHUB_USER}
        gitHubRepo={GITHUB_REPO} />
    );
  }
});

export default ProjectContainer;
