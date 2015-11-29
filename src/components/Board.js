import React, { PropTypes } from 'react';
import SwimLane from './SwimLane';
import _ from 'lodash';

const Board = ({ entries }) => {
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
  const categories = [
    'Unstarted', 'In Progress', 'Ready for Review', 'Merged', 'Delivered', 'Accepted'
  ];
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

Board.propTypes = { entries: PropTypes.array.isRequired };

export default Board;
