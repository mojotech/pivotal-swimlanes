import React from 'react';
import Entry from './Entry';
import _ from 'lodash';

const SwimLane = React.createClass({
  propTypes: {
    title: React.PropTypes.string.isRequired,
    entries: React.PropTypes.array.isRequired
  },

  render() {
    const { title, entries } = this.props;
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
        fontWeight: 600,
        lineHeight: '20px',
        color: '#f6f6f6'
      },
      entryList: { listStyleType: 'none', padding: 0 },
      entry: { paddingBottom: 5 }
    };
    return (
      <div style={styles.container}>
        <div style={styles.title}>{title}</div>
        <ul style={styles.entryList}>
          {_.map(entries, (entry, i) =>
            <li key={i} style={styles.entry}>
              <Entry entry={entry} />
            </li>
          )}
        </ul>
      </div>
    );
  }
});

export default SwimLane;
