import React, { Component } from 'react';
import Settings from '../components/Settings/Settings';
import Loading from '../components/shared/Loading';
import { getSettings, updateSettings } from '../utils/settings';
import $ from 'jquery';
import _ from 'lodash';

const pivotalAPI = 'https://www.pivotaltracker.com/services/v5';

class SettingsContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gitHubAuthorized: false,
      gitHubUser: '',
      gitHubToken: '',
      herokuAuthorized: false,
      pivotalProjects: [],
      pivotalToken: '',
      selectedPivotalProjectId: '',
      selectedRepo: ''
    };
  }

  componentDidMount() {
    this.fetchSettings().then(() => {
      this.fetchPivotalProjects();
      if (this.state.gitHubToken) {
        this.fetchGitHubAccount();
      }
    });
  }

  fetchGitHubAccount(){
    const { gitHubToken } = getSettings;
    $.ajax({
      url: `https://api.github.com/user?access_token=${gitHubToken}`,
      method: 'GET'
    }).then(data => {
      this.setState({ gitHubUser: data.login });
    });
  }

  fetchSettings() {
    return new Promise(resolve => {
      const {
        gitHubToken,
        pivotalToken,
        selectedRepo,
        selectedPivotalProjectId,
        selectedPivotalProject,
        herokuToken
      } = getSettings;
      this.setState({
        pivotalToken,
        gitHubToken,
        gitHubAuthorized: _.some(gitHubToken),
        selectedRepo,
        selectedPivotalProjectId,
        selectedPivotalProject,
        herokuAuthorized: _.some(herokuToken)
      }, resolve);
    });
  }

  fetchPivotalProjects() {
    let { pivotalToken } = getSettings;
    return $.ajax({
      url: `${pivotalAPI}/me`,
      method: 'GET',
      beforeSend: xhr => xhr.setRequestHeader('X-TrackerToken', pivotalToken)
    }).then(data => {
      let projects = _.map(data.projects, p => (
        { id: p.project_id, name: p.project_name })
      );
      this.setState({ pivotalProjects: projects });
    }).fail(() => this.setState({ error: true, pivotalProjects: null }));
  }

  saveSettings(changedData) {
    this.setState({ ...this.state, ...changedData });
    updateSettings({ ...getSettings, ...changedData });
    if (changedData.gitHubAuthorized === false) {
      updateSettings({ gitHubToken: null, selectedRepo: null });
    }
    if (changedData.herokuAuthorized === false) {
      updateSettings({ herokuToken: null });
    }
  }

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
      this.setState({ repos: _.map(_.take(data.items, 10), 'full_name') })
    ).fail(() =>
      this.setState({ gitHubRepos: [] })
    );
  }

  render() {
    const {
      pivotalToken,
      pivotalProjects,
      gitHubAuthorized,
      selectedRepo,
      selectedPivotalProjectId,
      herokuAuthorized,
      error
    } = this.state;
    const loading = _.isEmpty(pivotalProjects) && !error;
    return loading ? (
      <Loading />
    ) : (
      <Settings
        pivotalToken={pivotalToken}
        pivotalProjects={pivotalProjects}
        gitHubAuthorized={gitHubAuthorized}
        selectedRepo={selectedRepo}
        selectedPivotalProjectId={selectedPivotalProjectId}
        repos={this.state.repos}
        herokuAuthorized={herokuAuthorized}
        onSettingsChange={(data) => this.saveSettings(data)}
        onRepoQueryChange={(query) => this.searchRepo(query)}
        gitHubUser={this.state.gitHubUser}
        fetchPivotalProjects={() => this.fetchPivotalProjects()} />
    );
  }
};

export default SettingsContainer;
