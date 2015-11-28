import React from 'react';
import Settings from '../components/Settings';
import $ from 'jquery';
import _ from 'lodash';

const SettingsContainer = React.createClass({
  getInitialState() {
    return {};
  },

  componentDidMount() {
    this.fetchSettings();
  },

  fetchSettings() {
    const {
      gitHubToken,
      pivotalToken,
      pivotalProjectId,
      selectedRepo,
      herokuToken
    } = JSON.parse(localStorage.getItem('pivotal-swimlanes-config')) || {};
    this.setState({
      pivotalToken,
      pivotalProjectId,
      gitHubAuthorized: _.any(gitHubToken),
      selectedRepo,
      herokuAuthorized: _.any(herokuToken)
    });
    if (_.any(gitHubToken)) {
      this.fetchRepos(gitHubToken);
    }
  },

  fetchRepos(gitHubToken) {
    // TODO: I think this only returns the first 30 repos
    $.ajax({
      url: `https://api.github.com/user/repos?sort=pushed&access_token=${gitHubToken}`,
      method: 'GET'
    }).done(data => this.setState({ repos: _.pluck(data, 'full_name') }));
  },

  saveSettings(changedData) {
    const previousSettings = JSON.parse(
      localStorage.getItem('pivotal-swimlanes-config')
    ) || {};
    this.setState({
      ...this.state,
      ...changedData
    });
    localStorage.setItem(
      'pivotal-swimlanes-config',
      JSON.stringify({
        ...previousSettings,
        ...changedData
      })
    );
  },

  render() {
    const {
      pivotalToken,
      pivotalProjectId,
      gitHubAuthorized,
      selectedRepo,
      herokuAuthorized
    } = this.state;
    return (
      <Settings
        pivotalToken={pivotalToken}
        pivotalProjectId={pivotalProjectId}
        gitHubAuthorized={gitHubAuthorized}
        selectedRepo={selectedRepo}
        repos={this.state.repos}
        herokuAuthorized={herokuAuthorized}
        onChange={this.saveSettings} />
    );
  }
});

export default SettingsContainer;
