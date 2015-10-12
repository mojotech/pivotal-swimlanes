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
        authors: React.PropTypes.string.isRequired
      }).isRequired
    ).isRequired
  },

  render() {
    const { title, entries } = this.props;
    const styles = {
      container: { display: 'inline-block' },
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
              <Entry title={entry.title} url={entry.url} authors={entry.authors} />
            </li>
          )}
        </ul>
      </div>
    );
  }
});

export default SwimLane;
