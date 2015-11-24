import React from 'react';
import history from '../history'
import $ from 'jquery';

const Settings = React.createClass({
  getInitialState() {
    return { gitHubRepos: null };
  },

  componentDidMount() {
    const { gitHubToken } = JSON.parse(localStorage.getItem('pivotal-swimlanes-config')) || {};
    if (!_.isEmpty(gitHubToken)) {
      this._fetchRepos();
    }
  },

  _fetchRepos() {
    const { gitHubToken } = JSON.parse(localStorage.getItem('pivotal-swimlanes-config')) || {};
    // TODO: I think this only returns the first 30 repos
    $.ajax({
      url: `https://api.github.com/user/repos?sort=pushed&access_token=${gitHubToken}`,
      method: 'GET'
    }).done(data => this.setState({ gitHubRepos: data }));
  },

  saveSettings() {
    const { pivotalToken, pivotalProjectId, gitHubRepo } = this.refs;
    const {
      herokuToken,
      gitHubToken
    } = JSON.parse(localStorage.getItem('pivotal-swimlanes-config')) || {};
    localStorage.setItem(
      'pivotal-swimlanes-config',
      JSON.stringify({
        pivotalToken: pivotalToken.value,
        pivotalProjectId: pivotalProjectId.value,
        gitHubRepo: gitHubRepo ? gitHubRepo.value : '',
        gitHubToken,
        herokuToken
      })
    );
    this.forceUpdate();
  },

  render() {
    const {
      pivotalToken,
      pivotalProjectId,
      gitHubToken,
      gitHubUser,
      gitHubRepo,
      herokuToken
    } = JSON.parse(localStorage.getItem('pivotal-swimlanes-config')) || {};
    const { gitHubRepos } = this.state;
    return (
      <div>
        <h1>Pivotal Swimlanes Settings</h1>
        <form>
          <label><strong>Pivotal Token: </strong></label>
          <br />
          <input
            ref='pivotalToken'
            type='text'
            value={pivotalToken}
            onChange={this.saveSettings} />
          <br />
          <br />
          <label><strong>Pivotal Project ID: </strong></label>
          <br />
          <input
            ref='pivotalProjectId'
            type='text'
            value={pivotalProjectId}
            onChange={this.saveSettings} />
          <br />
          <br />
          <label><strong>GitHub Repo: </strong></label>
          <br />
          {_.isEmpty(gitHubToken) ? (
            <div>
              <a href='https://github.com/login/oauth/authorize?client_id=eea103fcc5e732e4c4c1&redirect_uri=http://localhost:3000/github_authorized&state=&scope=repo'>
                Authorize GitHub Account
              </a>
              <br />
            </div>
          ) : (
            <div>
              <select ref='gitHubRepo' defaultValue='' value={gitHubRepo} onChange={this.saveSettings}>
                <option value=''>Select a repo</option>
                {_.map(gitHubRepos, (repo, i) =>
                  <option key={i} value={repo.full_name}>
                    {repo.full_name}
                  </option>
                )}
              </select>
              <br />
            </div>
          )}
          <br />
          <label><strong>Heroku Account:</strong></label>
          <br />
          {_.isEmpty(herokuToken) ? (
            <div>
              <a href='https://id.heroku.com/oauth/authorize?client_id=cf243153-2c0f-4fcf-a808-878b5d699485&response_type=code&scope=read&state='>
                Authorize Heroku Account
              </a>
              <br />
            </div>
          ) : (
            <div>Account connected</div>
          )}
          <br />
          <button onClick={() => history.pushState(null, '/')}>Continue</button>
        </form>
      </div>
    );
  }
});

export default Settings;
