import React, { PropTypes } from 'react';
import history from '../../history';
import _ from 'lodash';

const randState = () => Math.random().toString(36).slice(2);

const Settings = ({
  pivotalToken,
  pivotalProjects,
  gitHubAuthorized,
  selectedRepo,
  selectedPivotalProjectId,
  repos,
  herokuAuthorized,
  onSettingsChange,
  onRepoQueryChange
}) => {
  const authorizeGitHub = e => {
    e.preventDefault();
    let state = randState();
    onSettingsChange({ state });
    let url = 'https://github.com/login/oauth/authorize?client_id=' + process.env.GITHUB_CLIENT_ID + '&redirect_uri=' + process.env.HOST + '/github_authorized&state=' + state + '&scope=repo';
    window.location.href = url;
  };

  const authorizeHeroku = e => {
    e.preventDefault();
    let state = randState();
    onSettingsChange({ state });
    let url = 'https://id.heroku.com/oauth/authorize?client_id=' + process.env.HEROKU_CLIENT_ID + '&response_type=code&scope=read&state=' + state;
    window.location.href = url;
  };

  const removeGitHubAccount = e => {
    e.preventDefault();
    onSettingsChange({ gitHubAuthorized: false });
  };

  const removeHerokuAccount = e => {
    e.preventDefault();
    onSettingsChange({ herokuAuthorized: false });
  };
  return (
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
        <label><strong>Pivotal Project: </strong></label>
        <br />
        <select onChange={e => onSettingsChange({ selectedPivotalProjectId: e.target.value })}>
          <option value='' disabled={_.any(selectedPivotalProjectId)}>
            Select a project
          </option>
          {_.map(pivotalProjects, project =>
            <option key={project.id} value={project.id} defaultValue=''>
              {project.name}
            </option>
          )}
        </select>
        <br />
        <br />
        <label><strong>GitHub Repo:</strong></label>
        <br />
        {gitHubAuthorized ? (
          <div>
            <div>[<a href='' onClick={removeGitHubAccount}>remove account</a>]</div>
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
          <div>
            Account connected [<a href='' onClick={removeHerokuAccount}>remove account</a>]
          </div>
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
};

Settings.propTypes = {
  pivotalToken: PropTypes.string,
  pivotalProjects: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired
    })
  ),
  selectedRepo: PropTypes.string,
  selectedPivotalProjectId: PropTypes.string,
  repos: PropTypes.arrayOf(PropTypes.string),
  herokuAuthorized: PropTypes.bool
};

export default Settings;
