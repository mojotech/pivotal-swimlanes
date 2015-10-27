import React from 'react';
import history from '../history'

const Setup = React.createClass({
  getInitialState() {
    return {
      pivotalToken: '',
      pivotalProjectId: '',
      gitHubToken: '',
      gitHubUser: '',
      gitHubRepo: ''
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
      gitHubRepo
    } = this.state;
    return (
      <div>
        <h1>Pivotal Swimlanes Setup</h1>
        <p>Please fill in the following credentials.</p>
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
          <label><strong>GitHub Token: </strong></label>
          <br />
          <input
            type='text'
            value={gitHubToken}
            onChange={e => this.setState({ gitHubToken: e.target.value })} />
          <br />
          <br />
          <label><strong>GitHub User/Organization: </strong></label>
          <br />
          <input
            type='text'
            value={gitHubUser}
            onChange={e => this.setState({ gitHubUser: e.target.value })} />
          <br />
          <br />
          <label><strong>GitHub Repo: </strong></label>
          <br />
          <input
            type='text'
            value={gitHubRepo}
            onChange={e => this.setState({ gitHubRepo: e.target.value })} />
          <br />
          <br />
          <button onClick={this.saveConfig}>Save</button>
        </form>
      </div>
    );
  }
});

export default Setup;
