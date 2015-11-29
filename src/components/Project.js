import React, { PropTypes } from 'react';
import HeaderBar from './HeaderBar';
import Board from './Board';

const Project = ({ projectName, entries }) => (
  <div>
    <HeaderBar projectName={projectName} />
    <Board entries={entries} />
  </div>
);

Project.propTypes = {
  projectName: PropTypes.string.isRequired,
  entries: PropTypes.array.isRequired
};

export default Project;
