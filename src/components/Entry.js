import React from 'react';
import { Paper } from 'material-ui';
import _ from 'underscore';

const Entry = React.createClass({
  propTypes: {
    entry: React.PropTypes.shape({
      title: React.PropTypes.string.isRequired,
      url: React.PropTypes.string.isRequired,
      authors: React.PropTypes.string.isRequired,
      type: React.PropTypes.oneOf(['feature', 'bug', 'chore', 'pr']),
      estimate: React.PropTypes.number.isRequired
    }).isRequired
  },

  render() {
    const styles = {
      content: { padding: 5 },
      link: { fontSize: 12 },
      authors: { fontSize: 10 }
    };
    const { title, url, authors, type, estimate } = this.props.entry;
    return (
      <Paper style={styles.content}>
        {_.isEmpty(type) ? null : <img src={require(`../img/${type}.png`)} alt={type} />}
        <div>{Array(estimate + 1).join('•')}</div>
        <a href={url} target='_new' style={styles.link}>{title}</a>
        <br />
        <div style={styles.authors}>{authors}</div>
      </Paper>
    );
  }
});

export default Entry;
