import React, { PropTypes } from 'react';
import Entry from './Entry';
import _ from 'lodash';

const SwimLane = ({ title, entries }) => {
  const styles = {
    container: {
      display: 'inline-block',
      verticalAlign: 'top',
      padding: 5,
      width: 224
    },
    title: {
      textAlign: 'center',
      font: "14px 'Helvetica Neue',Arial,Helvetica,sans-serif",
      fontSize: 18,
      fontWeight: 500,
      lineHeight: '20px',
      color: '#f6f6f6'
    },
    entryList: { listStyleType: 'none', padding: 0 },
    entry: { paddingBottom: 4 }
  };
  return (
    <div style={styles.container}>
      <div style={styles.title}>{title}</div>
      <ul style={styles.entryList}>
        {_.map(entries, (entry, i) =>
          <li key={i} style={styles.entry}>
            <Entry
              title={entry.title}
              owners={entry.owners}
              estimate={entry.estimate}
              reviewUrl={entry.reviewUrl}
              trackerUrl={entry.trackerUrl}
              type={entry.type}
              state={entry.state} />
          </li>
        )}
      </ul>
    </div>
  );
};

SwimLane.propTypes = {
  title: PropTypes.string.isRequired,
  entries: PropTypes.array.isRequired
};

export default SwimLane;
