import React, { PropTypes } from 'react';
import { Paper } from 'material-ui';
import _ from 'underscore';

const ExternalLinkIcon = require('react-icons/lib/fa/external-link');
const GitHubIcon = require('react-icons/lib/fa/github');

const styles = {
  content: { padding: 6, backgroundColor: '#FDFDFD', width: 224 },
  title: {
    fontSize: 12,
    whiteSpace: 'normal',
    wordWrap: 'break-word'
  },
  owners: {
    fontSize: 11,
    marginTop: 6,
    textOverflow: 'ellipsis',
    overflowX: 'hidden'
  },
  estimate: { paddingLeft: 5 },
  links: { float: 'right' },
  link: { paddingLeft: 4 }
};

const Entry = ({
  title,
  owners,
  estimate,
  pullRequests,
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
          pullRequests.map((pullRequest, i) => {
            let prStatusColor;
            switch (pullRequest.status) {
            case 'success':
              prStatusColor = '#50A32B';
              break;
            case 'pending':
              prStatusColor = '#C9A217';
              break;
            case 'failure':
              prStatusColor = '#AF1900';
              break;
            default:
              prStatusColor = 'black';
            }
            return (
              <a href={pullRequest.url} key={i} target='_new' style={styles.link}>
                <GitHubIcon style={{color: prStatusColor}}/>
              </a>
            );
          })
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
  pullRequests: PropTypes.arrayOf(
    PropTypes.shape({
      url: PropTypes.string.isRequired,
      status: PropTypes.string
    }).isRequired
  ).isRequired,
  trackerUrl: PropTypes.string,
  type: PropTypes.string.isRequired,
  state: PropTypes.string.isRequired
};

export default Entry;
