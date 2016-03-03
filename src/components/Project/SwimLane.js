import React, { PropTypes } from 'react';
import Entry from './Entry';
import _ from 'lodash';

const SwimLane = ({ title, entries }) => {
  const styles = {
    container: {
      display: 'inline-block',
      verticalAlign: 'top',
      width: 224,
      height: '100%',
      borderRight: '1px solid #F1F1F1',
      padding: 15
    },
    title: {
      font: "14px 'Helvetica Neue',Arial,Helvetica,sans-serif",
      fontSize: 16,
      fontWeight: 400,
      lineHeight: '20px',
      color: '#585757'
    },
    entryList: { listStyleType: 'none', padding: 0 },
    entry: { marginBottom: 10 }
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
