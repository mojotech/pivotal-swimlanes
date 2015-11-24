import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import _ from 'underscore';
import HeaderBar from './HeaderBar';
import Board from './Board';
import { CircularProgress } from 'material-ui';

const Project = React.createClass({
  propTypes: {
    projectName: React.PropTypes.string,
    entries: React.PropTypes.array,
    error: React.PropTypes.bool.isRequired
  },

  render() {
    let styles = {
      centered: { textAlign: 'center' }
    };
    let { projectName, entries, error } = this.props;
    let loading = (_.isEmpty(projectName) || _.isEmpty(entries)) && !error;
    return (
      <div>
        {loading ? (
          <div style={styles.centered}>
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
              <Board projectName={projectName} entries={entries} />
            </div>
          )
        )}
      </div>
    );
  }
});

export default Project;
