import React from 'react';
import { Paper } from 'material-ui';
import _ from 'underscore';

const Entry = React.createClass({
  propTypes: {
    entry: React.PropTypes.shape({
      title: React.PropTypes.string.isRequired,
      url: React.PropTypes.string.isRequired,
      authors: React.PropTypes.string.isRequired,
      kind: React.PropTypes.oneOf(['story', 'bug', 'chore']),
      estimate: React.PropTypes.number.isRequired
    }).isRequired
  },

  render() {
    const styles = {
      content: { padding: 5 },
      link: { fontSize: 12 },
      authors: { fontSize: 10 }
    };
    const { title, url, authors, kind, estimate } = this.props.entry;
    return (
      <Paper style={styles.content}>
        {_.isEmpty(kind) ? null : <img src={require(`../img/${kind}.png`)} alt={kind} />}
        <div>{Array(estimate).join('•')}</div>
        <a href={url} target='_new' style={styles.link}>{title}</a>
        <br />
        <div style={styles.authors}>{authors}</div>
      </Paper>
    );
  }
});

export default Entry;
