import React from 'react';
import { Link } from 'react-router';
import Project from '../components/Project/Project';
import Loading from '../components/shared/Loading';
import _ from 'lodash';
import fetchData from '../lib/fetchData';
import { getSettings } from '../settings';

const ProjectContainer = React.createClass({
  getInitialState() {
    return {
      projectName: null,
      entries: null,
      error: false
    };
  },

  componentDidMount() {
    fetchData().then(({ projectName, entries }) => {
      this.setState({ projectName, entries });
    });
  },

  render() {
    let { projectName, entries, error } = this.state;
    let loading = (_.isEmpty(projectName) || _.isEmpty(entries)) && !error;
    const { selectedRepo } = getSettings;
    const hasSelectedRepo = (selectedRepo !== null && selectedRepo !== undefined);
    return (
      loading ? (
        <Loading />
      ) : (
        error ? (
          <div>
            <p>Error fetching data.</p>
            <Link to='settings'>Configure Settings</Link>
          </div>
        ) : (
          <Project
            projectName={projectName}
            entries={entries}
            hasSelectedRepo={hasSelectedRepo} />
        )
      )
    );
  }
});

export default ProjectContainer;
