import React from 'react';
import { Paper } from 'material-ui';

const Entry = React.createClass({
  propTypes: {
    title: React.PropTypes.string.isRequired,
    url: React.PropTypes.string.isRequired,
    authors: React.PropTypes.string.isRequired
  },

  render() {
    const styles = {
      entryContent: { padding: 8 },
      entryLink: { fontSize: 12 },
      entryAuthors: { fontSize: 10 }
    };
    const { title, url, authors } = this.props;

    return (
      <Paper style={styles.entryContent}>
        <a href={url} target='_new' style={styles.entryLink}>{title}</a>
        <br />
        <div style={styles.entryAuthors}>{authors}</div>
      </Paper>
    );
  }
});

export default Entry;
