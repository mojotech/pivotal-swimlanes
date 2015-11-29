import React, { PropTypes } from 'react';
import { Paper } from 'material-ui';
import _ from 'underscore';

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

const Entry = ({
  title,
  owners,
  estimate,
  reviewUrl,
  trackerUrl,
  type,
  state
}) => (
  <Paper style={styles.content}>
    <div>
      {_.isEmpty(type) ? null : <img src={require(`./img/${type}.png`)} alt={type} />}
      {estimate ? <span style={styles.estimate}>{Array(estimate + 1).join('•')}</span> : null}
      <div style={styles.links}>
        {state === 'Ready for Review' ? (
          <a href={reviewUrl} target='_new' style={styles.link}>
            <img src={require('./img/pr.png')} />
          </a>
        ) : null}
        <a href={trackerUrl} target='_new' style={styles.link}>
          <img src={require('./img/open_in_new.png')} />
        </a>
      </div>
    </div>
    <div style={styles.title}>{title}</div>
    <div style={styles.owners}>{owners.join(', ')}</div>
  </Paper>
);

Entry.propTypes = {
  title: PropTypes.string.isRequired,
  owners: PropTypes.arrayOf(PropTypes.string),
  estimate: PropTypes.number,
  reviewUrl: PropTypes.string,
  trackerUrl: PropTypes.string,
  type: PropTypes.string.isRequired,
  state: PropTypes.string.isRequired
};

export default Entry;
