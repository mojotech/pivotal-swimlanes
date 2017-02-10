import React, { PropTypes } from 'react';
import SwimLane from './SwimLane';
import _ from 'lodash';

const Board = ({ entries, sidebarVisible, hasSelectedRepo }) => {  
  const categories = [
    {label: 'Unstarted',display: true},
    {label: 'In Progress',display: true},
    {label: 'Ready for Review',display: hasSelectedRepo},
    {label: 'Merged',display: true},
    {label: 'Delivered',display: true},
    {label: 'Accepted',display: true}
  ];

  const styles = {
    board: {
      position: 'absolute',
      top: 50,
      left: sidebarVisible ? 220 : 'auto',
      overflow: 'scroll',
      whiteSpace: 'nowrap',
      backgroundColor: '#FFFFFF',
      width: '100%',
      display: 'table',
      overflowY: 'scroll'
    }
  };
  
  const categoriesToDisplay = categories.filter(c => c.display);
  return (
    <div style={styles.board}>
      {_.map(categoriesToDisplay, (category, i) => {
        return (
          <SwimLane
            key={i}
            title={category.label}
            entries={_.filter(entries, entry => entry.state === category.label)} />
        );
      })}
    </div>
  );
};

Board.propTypes = {
  entries: PropTypes.array.isRequired,
  sidebarVisible: PropTypes.bool.isRequired,
  hasSelectedRepo: PropTypes.bool.isRequired
};

export default Board;
