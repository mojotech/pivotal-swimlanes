import React from 'react';
import { Paper } from 'material-ui';

const Entry = React.createClass({
  propTypes: {
    title: React.PropTypes.string.isRequired,
    url: React.PropTypes.string.isRequired,
    authors: React.PropTypes.string.isRequired,
    estimate: React.PropTypes.number.isRequired
  },

  render() {
    const styles = {
      entryContent: { padding: 8 },
      entryLink: { fontSize: 12 },
      entryAuthors: { fontSize: 10 }
    };
    const { title, url, authors, estimate } = this.props;

    return (
      <Paper style={styles.entryContent}>
        <div>{Array(estimate).join('•')}</div>
        <a href={url} target='_new' style={styles.entryLink}>{title}</a>
        <br />
        <div style={styles.entryAuthors}>{authors}</div>
      </Paper>
    );
  }
});

export default Entry;
