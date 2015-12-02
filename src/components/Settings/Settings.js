import React, { PropTypes } from 'react';
import history from '../../history';
import { updateSettings } from '../../settings';
import _ from 'lodash';

const randState = () => Math.random().toString(36).slice(2);

const authorizeGitHub = e => {
  e.preventDefault();
  let state = randState();
  updateSettings({ state });
  let url = 'https://github.com/login/oauth/authorize?client_id=' + process.env.GITHUB_CLIENT_ID + '&redirect_uri=' + process.env.HOST + '/github_authorized&state=' + state + '&scope=repo';
  window.location.href = url;
};

const authorizeHeroku = e => {
  e.preventDefault();
  let state = randState();
  updateSettings({ state });
  let url = 'https://id.heroku.com/oauth/authorize?client_id=' + process.env.HEROKU_CLIENT_ID + '&response_type=code&scope=read&state=' + state;
  window.location.href = url;
};

const Settings = ({
  pivotalToken,
  pivotalProjectId,
  gitHubAuthorized,
  selectedRepo,
  repos,
  herokuAuthorized,
  onSettingsChange,
  onRepoQueryChange
}) => (
  <div>
    <h1>Pivotal Swimlanes Settings</h1>
    <form>
      <label><strong>Pivotal Token: </strong></label>
      <br />
      <input
        type='text'
        value={pivotalToken}
        onChange={e => onSettingsChange({ pivotalToken: e.target.value })} />
      <br />
      <br />
      <label><strong>Pivotal Project ID: </strong></label>
      <br />
      <input
        type='text'
        value={pivotalProjectId}
        onChange={e => onSettingsChange({ pivotalProjectId: e.target.value })} />
      <br />
      <br />
      <label><strong>GitHub Repo: </strong></label>
      <br />
      {gitHubAuthorized ? (
        <div>
          <input
            type='text'
            placeholder='Search Repos'
            onChange={_.debounce(e => onRepoQueryChange(e.target.value), 500)} />
          {_.any(selectedRepo) ? <p><strong>Selected: {selectedRepo}</strong></p> : null}
          {_.any(repos) ? (
            <ul>
              {_.map(repos, (repo, i) =>
                <li
                  key={i}
                  style={{cursor: 'pointer'}}
                  onClick={() => onSettingsChange({ selectedRepo: repo })}
                >
                  {repo}
                </li>
              )}
            </ul>
          ) : (
            <p>No repos found.</p>
          )}
        </div>
      ) : (
        <div>
          <a href='' onClick={authorizeGitHub}>
            Authorize GitHub Account
          </a>
          <br />
        </div>
      )}
      <br />
      <label><strong>Heroku Account:</strong></label>
      <br />
      {herokuAuthorized ? (
        <div>Account connected</div>
      ) : (
        <div>
          <a href='' onClick={authorizeHeroku}>
            Authorize Heroku Account
          </a>
          <br />
        </div>
      )}
      <br />
      <button onClick={() => history.pushState(null, '/')}>Continue</button>
    </form>
  </div>
);

Settings.propTypes = {
  pivotalToken: PropTypes.string,
  pivotalProjectId: PropTypes.string,
  selectedRepo: PropTypes.string,
  repos: PropTypes.arrayOf(PropTypes.string),
  herokuAuthorized: PropTypes.bool
};

export default Settings;
