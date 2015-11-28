import React, { PropTypes } from 'react';
import SwimLane from './SwimLane';
import _ from 'lodash';

const Board = ({ projectName, entries }) => {
  const unstartedEntries = _.filter(entries, entry => entry.state === 'Unstarted');
  const inProgressEntries = _.filter(entries, entry => entry.state === 'In Progress');
  const readyForReviewEntries = _.filter(entries, entry => entry.state === 'Ready for Review');
  const mergedEntries = _.filter(entries, entry => entry.state === 'Merged');
  const deliveredEntries = _.filter(entries, entry => entry.state === 'Delivered');
  const acceptedEntries = _.filter(entries, entry => entry.state === 'Accepted');
  const styles = {
    board: {
      overflow: 'scroll',
      whiteSpace: 'nowrap',
      backgroundColor: '#4E57A3',
      padding: 5,
      height: '100vh',
      width: '100%'
    }
  };

  return (
    <div style={styles.board}>
      <SwimLane title='Unstarted' entries={unstartedEntries} />
      <SwimLane title='In Progress' entries={inProgressEntries} />
      <SwimLane title='Ready for Review' entries={readyForReviewEntries} />
      <SwimLane title='Merged' entries={mergedEntries} />
      <SwimLane title='Delivered' entries={deliveredEntries} />
      <SwimLane title='Accepted' entries={acceptedEntries} />
    </div>
  );
};

Board.propTypes = {
  projectName: PropTypes.string.isRequired,
  entries: PropTypes.array.isRequired
};

export default Board;
