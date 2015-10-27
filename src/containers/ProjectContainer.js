import React from 'react';
import Project from '../components/Project';

const ProjectContainer = React.createClass({
  render() {
    const {
      pivotalToken,
      pivotalProjectId,
      gitHubToken,
      gitHubUser,
      gitHubRepo
    } = JSON.parse(localStorage.getItem('pivotal-swimlanes-config'));
    return (
      <Project
        pivotalToken={pivotalToken}
        pivotalProjectId={pivotalProjectId}
        gitHubToken={gitHubToken}
        gitHubUser={gitHubUser}
        gitHubRepo={gitHubRepo} />
    );
  }
});

export default ProjectContainer;
