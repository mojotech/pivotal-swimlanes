import React from 'react';
import Entry from './Entry';
import _ from 'lodash';

const SwimLane = React.createClass({
  propTypes: {
    title: React.PropTypes.string.isRequired,
    entries: React.PropTypes.arrayOf(
      React.PropTypes.shape({
        title: React.PropTypes.string.isRequired,
        url: React.PropTypes.string.isRequired,
        authors: React.PropTypes.string.isRequired,
        type: React.PropTypes.oneOf(['story', 'bug', 'chore']),
        estimate: React.PropTypes.number.isRequired
      }).isRequired
    ).isRequired
  },

  render() {
    const { title, entries } = this.props;
    const styles = {
      container: { display: 'inline-block', verticalAlign: 'top' },
      title: { textAlign: 'center' },
      entryList: { listStyleType: 'none' },
      entry: { paddingBottom: 5 }
    };
    return (
      <div style={styles.container}>
        <h2 style={styles.title}>{title}</h2>
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
