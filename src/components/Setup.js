import React from 'react';
import history from '../history'
import $ from 'jquery';

const Setup = React.createClass({
  getInitialState() {
    return {
      pivotalToken: '',
      pivotalProjectId: '',
      gitHubToken: '',
      gitHubUser: '',
      gitHubRepo: '',
      gitHubRepos: '',
      fetchingData: false
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
    },
      () => {
        if (!_.isEmpty(gitHubToken)) {
          this._fetchRepos();
        }
      }
    );
  },

  _fetchRepos() {
    this.setState({ fetchingData: true });
    // TODO: I think this only returns the first 30 repos
    $.ajax({
      url: `https://api.github.com/user/repos?sort=pushed&access_token=${this.state.gitHubToken}`,
      method: 'GET'
    }).done(data =>
      this.setState({ gitHubRepos: data })
    ).always(() =>
      this.setState({ fetchingData: false })
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
      gitHubRepos,
      fetchingData
    } = this.state;
    if (fetchingData) {
      return <div>Loading...</div>;
    }
    return (
      <div>
        <h1>Pivotal Swimlanes Setup</h1>
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
              <select>
                {_.map(gitHubRepos, (repo, i) =>
                  <option
                    key={i}
                    value={repo.full_name}
                    selected={repo.full_name === `${gitHubUser}/${gitHubRepo}`}
                    onChange={() =>
                      this.setState({ gitHubUser: repo.full_name.split('/')[0], gitHubRepo: repo.name })
                    }>
                      {repo.full_name}
                  </option>
                )}
              </select>
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

export default Setup;
