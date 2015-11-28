import React from 'react';
import { Paper } from 'material-ui';
import _ from 'underscore';

const Entry = React.createClass({
  propTypes: {
    entry: React.PropTypes.shape({
      title: React.PropTypes.string.isRequired,
      owners: React.PropTypes.arrayOf(React.PropTypes.string),
      estimate: React.PropTypes.number,
      reviewUrl: React.PropTypes.string,
      trackerUrl: React.PropTypes.string,
      type: React.PropTypes.string.isRequired,
      state: React.PropTypes.string.isRequired
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
      owners: { fontSize: 10 },
      estimate: { paddingLeft: 5 },
      links: { float: 'right' },
      link: { paddingLeft: 4 }
    };
    const {
      title,
      owners,
      estimate,
      reviewUrl,
      trackerUrl,
      type,
      state
    } = this.props.entry;
    return (
      <Paper style={styles.content}>
        <div>
          {_.isEmpty(type) ? null : <img src={require(`../img/${type}.png`)} alt={type} />}
          {estimate ? <span style={styles.estimate}>{Array(estimate + 1).join('•')}</span> : null}
          <div style={styles.links}>
            {state === 'Ready for Review' ? (
              <a href={reviewUrl} target='_new' style={styles.link}>
                <img src={require('../img/pr.png')} />
              </a>
            ) : null}
            <a href={trackerUrl} target='_new' style={styles.link}>
              <img src={require('../img/open_in_new.png')} />
            </a>
          </div>
        </div>
        <div style={styles.title}>{title}</div>
        <div style={styles.owners}>{owners.join(', ')}</div>
      </Paper>
    );
  }
});

export default Entry;
