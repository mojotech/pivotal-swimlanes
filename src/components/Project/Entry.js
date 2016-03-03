import React, { PropTypes } from 'react';
import { Paper } from 'material-ui';
import _ from 'underscore';

const ExternalLinkIcon = require('react-icons/lib/fa/external-link');

const styles = {
  content: { padding: 6, backgroundColor: '#FDFDFD' },
  title: {
    fontSize: 12,
    whiteSpace: 'normal'
  },
  owners: { fontSize: 11, marginTop: 6 },
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
          <ExternalLinkIcon style={{color: '#000000', fontSize: 14}} />
        </a>
      </div>
    </div>
    <div style={styles.title}>{title}</div>
    {_.any(owners) ? <div style={styles.owners}>{owners.join(', ')}</div> : null}
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
