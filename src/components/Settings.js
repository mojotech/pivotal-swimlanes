import React, { PropTypes } from 'react';
import history from '../history';
import _ from 'lodash';

const Settings = ({
  pivotalToken,
  pivotalProjectId,
  gitHubAuthorized,
  selectedRepo,
  repos,
  herokuAuthorized,
  onChange
}) => {
  return (
    <div>
      <h1>Pivotal Swimlanes Settings</h1>
      <form>
        <label><strong>Pivotal Token: </strong></label>
        <br />
        <input
          type='text'
          value={pivotalToken}
          onChange={e => onChange({ pivotalToken: e.target.value })} />
        <br />
        <br />
        <label><strong>Pivotal Project ID: </strong></label>
        <br />
        <input
          type='text'
          value={pivotalProjectId}
          onChange={e => onChange({ pivotalProjectId: e.target.value })} />
        <br />
        <br />
        <label><strong>GitHub Repo: </strong></label>
        <br />
        {gitHubAuthorized ? (
          <div>
            <select defaultValue='' value={selectedRepo} onChange={e => onChange({ selectedRepo: e.target.value })}>
              <option value=''>Select a repo</option>
              {_.map(repos, (repo, i) =>
                <option key={i} value={repo}>
                  {repo}
                </option>
              )}
            </select>
            <br />
          </div>
        ) : (
          <div>
            <a href='https://github.com/login/oauth/authorize?client_id=eea103fcc5e732e4c4c1&redirect_uri=http://localhost:3000/github_authorized&state=&scope=repo'>
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
            <a href='https://id.heroku.com/oauth/authorize?client_id=cf243153-2c0f-4fcf-a808-878b5d699485&response_type=code&scope=read&state='>
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
};

Settings.propTypes = {
  pivotalToken: PropTypes.string,
  pivotalProjectId: PropTypes.string,
  selectedRepo: PropTypes.string,
  repos: PropTypes.arrayOf(PropTypes.string),
  herokuAuthorized: PropTypes.bool
};

export default Settings;
