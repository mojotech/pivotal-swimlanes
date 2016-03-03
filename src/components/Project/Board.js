import React, { PropTypes } from 'react';
import SwimLane from './SwimLane';
import _ from 'lodash';

const categories = [
  'Unstarted', 'In Progress', 'Ready for Review', 'Merged', 'Delivered', 'Accepted'
];

const Board = ({ entries, sidebarVisible }) => {
  const styles = {
    board: {
      position: 'absolute',
      top: 50,
      left: sidebarVisible ? 220 : 'auto',
      overflow: 'scroll',
      whiteSpace: 'nowrap',
      backgroundColor: '#FFFFFF',
      height: '100vh',
      width: '100%'
    }
  };
  return (
    <div style={styles.board}>
      {_.map(categories, (category, i) => (
        <SwimLane
          key={i}
          title={category}
          entries={_.filter(entries, entry => entry.state === category)} />
      ))}
    </div>
  );
};

Board.propTypes = {
  entries: PropTypes.array.isRequired,
  sidebarVisible: PropTypes.bool.isRequired
};

export default Board;
