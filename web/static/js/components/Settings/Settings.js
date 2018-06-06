import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import _ from 'lodash';
import HeaderBar from '../shared/HeaderBar';
import FlatButton from 'material-ui/FlatButton';
import Autocomplete from 'react-autocomplete';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

const styles = {
  item: {
    padding: '2px 6px',
    cursor: 'default'
  },

  highlightedItem: {
    color: 'white',
    background: '#0094D9',
    padding: '2px 6px',
    cursor: 'default'
  }
};

const randState = () => Math.random().toString(36).slice(2);

const Settings = ({
  pivotalToken,
  pivotalProjects,
  gitHubAuthorized,
  selectedRepo,
  selectedPivotalProjectId,
  repos,
  onSettingsChange,
  onRepoQueryChange,
  gitHubUser,
  fetchPivotalProjects,
  logoutUser,
  isLoggedIn,
  currentUser,
  onFormSubmit,
  onSetData,
  onSetField
}) => {
  const authorizeGitHub = e => {
    e.preventDefault();
    let state = randState();
    onSettingsChange({ state });
    let url = 'https://github.com/login/oauth/authorize?client_id=' + process.env.GITHUB_CLIENT_ID + '&redirect_uri=' + process.env.HOST + '/github_authorized&state=' + state + '&scope=repo';
    window.location.href = url;
  };

  const removeGitHubAccount = e => {
    e.preventDefault();
    onSettingsChange({ gitHubAuthorized: false, selectedRepo: null });
  };

  const repoChangeHandler = _.debounce(onRepoQueryChange, 500);

  const handlePivotalFormSubmit = (e) => {
    e.preventDefault();
    onFormSubmit(currentUser.id);
  };

  return (
    <div className='settings-container'>
      <HeaderBar
        heading='Swimlanes Settings'
        sidebarVisible={false}
        showFilter={false}
        showSettings={false}
        logoutUser={logoutUser}
        isLoggedIn={isLoggedIn} />

      <form onSubmit={(e) => handlePivotalFormSubmit(e)}>
        <h3 className='section-heading'>Pivotal settings</h3>
        <label><strong>Pivotal API Token: </strong></label>
         <div className='label-note'>This is found at the bottom of your Pivotal profile.</div>
        <input
          type='text'
          className = 'input api-token'
          value={pivotalToken}
          onChange={e => onSetField('pivotal_token', e.target.value)}
          onBlur={fetchPivotalProjects} />
        <br />
        <label><strong>Pivotal Project: </strong></label>
        <br />
        <select
          defaultValue={selectedPivotalProjectId}
          className = 'input'
          onChange={e => onSetField('pivotal_project_id', e.target.value)}>
          <option value='' disabled={_.some(selectedPivotalProjectId)}>
            Select a project
          </option>
          {_.map(pivotalProjects, project =>
            <option key={project.id} value={project.id} defaultValue=''>
              {project.name}
            </option>
          )}
        </select>
        <div className='form-buttons'>
          <div className='flat-button'>
            <MuiThemeProvider>
              <FlatButton
                label='Save Pivotal Changes'
                type='submit'
                backgroundColor='#FF8900'
                labelStyle={{color:'#FFFFFF' }} />
            </MuiThemeProvider>
          </div>
          <div className='flat-button'>
            <MuiThemeProvider>
              <FlatButton
                label='Cancel'
                onClick={() => onSetData()}
                backgroundColor='#ccd1d5'
                labelStyle={{color:'#000000' }} />
            </MuiThemeProvider>
          </div>
        </div>
      </form>
      <br />

      <form>
        <br />
         <h3 className='section-heading'>GitHub settings</h3>
        {gitHubAuthorized ? (
          <div>
            <div>
              <label><strong>GitHub account:</strong></label>
              <br />
              <label>{gitHubUser}</label>
              <MuiThemeProvider>
                <FlatButton
                  label='Remove account'
                  onClick={removeGitHubAccount}
                  backgroundColor='#FF8900'
                  labelStyle={{color:'#FFFFFF', fontSize:10 }}
                  style={{lineHeight:1.3}} />
              </MuiThemeProvider>
            </div>
            <br />
            <br />
            <label><strong>Selected GitHub Repo:</strong></label>
             <br />
            {selectedRepo ? (
              <span>
                <label>{selectedRepo}</label>
                <MuiThemeProvider>
                  <FlatButton
                    label='Remove repo'
                    onClick={() => onSettingsChange({ selectedRepo: null })}
                    backgroundColor='#FF8900'
                    labelStyle={{color:'#FFFFFF', fontSize:10 }}
                    style={{lineHeight:1.3}} />
                </MuiThemeProvider>
              </span>
            ) : (
              <label>[None]</label>
            )}
            <br />
            <br />
            <Autocomplete
              value={selectedRepo}
              labelText='GitHub Repo:'
              items={repos || []}
              getItemValue={(item) => item}
              shouldItemRender={()=>true}
              inputProps={{className:'input', style:{marginBottom:3}}}
              menuStyle={{backgroundColor:'#FFFFFF'}}
              onChange={(e, val) => repoChangeHandler(val)}
              onSelect={(e,val) => onSettingsChange({ selectedRepo: val })}
              renderItem={(item, isHighlighted) => (
                <div
                  style={isHighlighted ? styles.highlightedItem : styles.item}
                  key={item}
                >{item}</div>
              )}/>
          </div>
        ) : (
          <div>
            <MuiThemeProvider>
              <FlatButton
                label='Authorize GitHub Account'
                onClick={authorizeGitHub}
                backgroundColor='#FF8900'
                labelStyle={{color:'#FFFFFF' }} />
            </MuiThemeProvider>
            <br />
          </div>
        )}
        <br />
        <Link to='/projects'>
          <MuiThemeProvider>
            <FlatButton
              label='Continue'
              backgroundColor='#0094D9'
              labelStyle={{color:'#FFFFFF'}}/>
          </MuiThemeProvider>
        </Link>
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
  gitHubAuthorized: PropTypes.bool,
  onSettingsChange: PropTypes.func,
  onRepoQueryChange: PropTypes.func,
  gitHubUser: PropTypes.string,
  fetchPivotalProjects: PropTypes.func,
  herokuAuthorized: PropTypes.bool,
  logoutUser: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  currentUser: PropTypes.object.isRequired,
  onFormSubmit: PropTypes.func.isRequired,
  onSetData: PropTypes.func.isRequired,
  onSetField: PropTypes.func.isRequired
};

export default Settings;
