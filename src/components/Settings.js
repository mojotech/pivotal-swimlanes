import React from 'react';
import history from '../history'
import $ from 'jquery';
import _ from 'underscore';

const Settings = React.createClass({
  getInitialState() {
    return {
      pivotalToken: '',
      pivotalProjectId: '',
      gitHubToken: '',
      gitHubUser: '',
      gitHubRepo: '',
      gitHubRepos: ''
    };
  },

  componentDidMount() {
    const {
      pivotalToken,
      pivotalProjectId,
      gitHubToken,
      gitHubUser,
      gitHubRepo
    } = JSON.parse(localStorage.getItem('pivotal-swimlanes-config')) || {};
    this.setState({
      pivotalToken,
      pivotalProjectId,
      gitHubToken,
      gitHubUser,
      gitHubRepo
    });
  },

  _searchRepo(e) {
    let query = e.target.value;
    if (query.length === 0) {
      this.setState({ gitHubRepos: [] });
      return
    };

    const [user, repo] = query.split('/')

    let url = ''
    url += 'https://api.github.com/search/repositories'
    url += '?'
    url += $.param({
      access_token: this.state.gitHubToken,
      q: repo || query
    });
    if (repo) { url += `+user:${user}` }

    $.ajax({
      url: url,
      method: 'GET'
    }).done(data =>
      this.setState({ gitHubRepos: data.items })
    ).fail(data =>
      this.setState({ gitHubRepos: [] })
    );
  },

  saveConfig() {
    const {
      pivotalToken,
      pivotalProjectId,
      gitHubToken,
      gitHubUser,
      gitHubRepo
    } = this.state;
    localStorage.setItem(
      'pivotal-swimlanes-config',
      JSON.stringify({
        pivotalToken,
        pivotalProjectId,
        gitHubToken,
        gitHubUser,
        gitHubRepo
      })
    );
    history.pushState(null, '/')
  },

  render() {
    const {
      pivotalToken,
      pivotalProjectId,
      gitHubToken,
      gitHubUser,
      gitHubRepo,
      gitHubRepos
    } = this.state;
    return (
      <div>
        <h1>Pivotal Swimlanes Settings</h1>
        <form>
          <label><strong>Pivotal Token: </strong></label>
          <br />
          <input
            type='text'
            value={pivotalToken}
            onChange={e => this.setState({ pivotalToken: e.target.value })} />
          <br />
          <br />
          <label><strong>Pivotal Project ID: </strong></label>
          <br />
          <input
            type='text'
            value={pivotalProjectId}
            onChange={e => this.setState({ pivotalProjectId: e.target.value })} />
          <br />
          <br />
          <label><strong>GitHub Repo: </strong></label>
          <br />
          {_.isEmpty(gitHubToken) ? (
            <a href='https://github.com/login/oauth/authorize?client_id=eea103fcc5e732e4c4c1&redirect_uri=http://localhost:3000/github_authorized&state=&scope=repo'>
              Authorize GitHub Account
            </a>
          ) : (
            <div>
              <input
                type='text'
                placeholder='Search Repos'
                onChange={_.debounce(this._searchRepo, 500)} />
              <p><strong>Selected: {this.state.gitHubUser}/{this.state.gitHubRepo}</strong></p>
              <ul>
                {_.map(gitHubRepos, (repo, i) =>
                  <li key={i} onClick={() => this.setState({ gitHubUser: repo.owner.login, gitHubRepo: repo.name }) }>
                    {repo.full_name}
                  </li>
                )}
              </ul>
              <br />
            </div>
          )}
          <br />
          <button onClick={this.saveConfig}>Save</button>
        </form>
      </div>
    );
  }
});

export default Settings;
