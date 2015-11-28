import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import _ from 'underscore';
import HeaderBar from './HeaderBar';
import Board from './Board';
import { CircularProgress } from 'material-ui';

const Project = ({ projectName, entries, error }) => {
  let loading = (_.isEmpty(projectName) || _.isEmpty(entries)) && !error;
  return (
    <div>
      {loading ? (
        <div style={{textAlign: 'center'}}>
          <CircularProgress mode='indeterminate' />
        </div>
      ) : (
        error ? (
          <div>
            <p>Error fetching data.</p>
            <Link to='settings'>Configure Settings</Link>
          </div>
        ) : (
          <div>
            <HeaderBar projectName={projectName} />
            <Board entries={entries} />
          </div>
        )
      )}
    </div>
  );
};

Project.propTypes = {
  projectName: PropTypes.string,
  entries: PropTypes.array,
  error: PropTypes.bool.isRequired
};

export default Project;
