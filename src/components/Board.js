import React from 'react';
import SwimLane from './SwimLane';
import _ from 'lodash';

const Board = React.createClass({
  propTypes: {
    projectName: React.PropTypes.string.isRequired,
    stories: React.PropTypes.array.isRequired,
    pullRequests: React.PropTypes.array.isRequired
  },

  render() {
    const { stories, pullRequests } = this.props;
    const unstartedEntries = _.filter(stories, story => story.current_state === 'unstarted' || story.current_state === 'planned')
    const inProgressEntries = _.filter(stories, story => story.current_state === 'started')
    const rejectedEntries = _.filter(stories, story => story.current_state === 'rejected')
    const readyForReviewEntries = pullRequests;
    const mergedEntries = _.filter(stories, story => story.current_state === 'finished')
    const deliveredEntries = _.filter(stories, story => story.current_state === 'delivered')
    const acceptedEntries = _.filter(stories, story => story.current_state === 'accepted')

    return (
      <div style={{overflow: 'scroll', whiteSpace: 'nowrap'}}>
        <SwimLane title='Unstarted' entries={unstartedEntries} />
        <SwimLane title='In Progress' entries={inProgressEntries} />
        <SwimLane title='Rejected' entries={rejectedEntries} />
        <SwimLane title='Ready for Review' entries={readyForReviewEntries} />
        <SwimLane title='Merged' entries={mergedEntries} />
        <SwimLane title='Delivered' entries={deliveredEntries} />
        <SwimLane title='Accepted' entries={acceptedEntries} />
      </div>
    );
  }
});

export default Board;
