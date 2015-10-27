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
      content: { padding: 5, backgroundColor: '#F9F9F9' },
      title: {
        fontSize: 12,
        whiteSpace: 'normal',
        paddingTop: 3,
        paddingBottom: 3
      },
      authors: { fontSize: 10 },
      estimate: { paddingLeft: 5 },
      link: { float: 'right' }
    };
    const { title, url, authors, type, estimate } = this.props.entry;
    return (
      <Paper style={styles.content}>
        <div>
          {_.isEmpty(type) ? null : <img src={require(`../img/${type}.png`)} alt={type} />}
          <span style={styles.estimate}>{Array(estimate + 1).join('•')}</span>
          <a href={url} target='_new'>
            <img src={require('../img/open_in_new.png')} style={styles.link} />
          </a>
        </div>
        <div style={styles.title}>{title}</div>
        <div style={styles.authors}>{authors}</div>
      </Paper>
    );
  }
});

export default Entry;
