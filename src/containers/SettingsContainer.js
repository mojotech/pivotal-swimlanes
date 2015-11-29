import React from 'react';
import Settings from '../components/Settings/Settings';
import { getSettings, updateSettings } from '../settings';
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
    } = getSettings();
    this.setState({
      pivotalToken,
      pivotalProjectId,
      gitHubToken,
      gitHubAuthorized: _.any(gitHubToken),
      selectedRepo,
      herokuAuthorized: _.any(herokuToken)
    });
  },

  saveSettings(changedData) {
    this.setState({ ...this.state, ...changedData });
    updateSettings({ ...getSettings(), ...changedData });
  },

  /* eslint-disable camelcase */
  searchRepo(query) {
    if (query.length === 0) {
      this.setState({ repos: [] });
      return;
    };

    const [user, repo] = query.split('/');

    let url = '';
    url += 'https://api.github.com/search/repositories';
    url += '?';
    url += $.param({
      access_token: this.state.gitHubToken,
      q: repo || query
    });
    if (repo) { url += `+user:${user}`; }

    $.ajax({
      url: url,
      method: 'GET'
    }).done(data =>
      this.setState({ repos: _(data.items).take(10).pluck('full_name').value() })
    ).fail(() =>
      this.setState({ gitHubRepos: [] })
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
        onSettingsChange={this.saveSettings}
        onRepoQueryChange={this.searchRepo} />
    );
  }
});

export default SettingsContainer;
