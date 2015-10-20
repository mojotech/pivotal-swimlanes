import React from 'react';
import SwimLane from './SwimLane';
import _ from 'lodash';

const Board = React.createClass({
  propTypes: {
    projectName: React.PropTypes.string.isRequired,
    stories: React.PropTypes.array.isRequired,
    pullRequests: React.PropTypes.array.isRequired
  },

  _mapOwnerIdToName(id) {
    switch (id) {
    case 1584218:
      return 'DSK';
    case 1062813:
      return 'MB';
    case 1333386:
      return 'DK';
    case 1462994:
      return 'JL';
    case 1079920:
      return 'JB';
    case 168061:
      return 'AS';
    default:
      return id;
    }
  },

  render() {
    const { stories, pullRequests } = this.props;
    const storyAttributes = story => {
      return {
        title: story.name,
        url: story.url,
        authors: story.owner_ids.map(id => this._mapOwnerIdToName(id)).join(', '),
        kind: story.kind,
        estimate: story.estimate || 0
      };
    };
    const unstartedEntries =
      _(stories)
        .filter(story => story.current_state === 'unstarted' || story.current_state === 'planned')
        .map(storyAttributes)
        .value();
    const rejectedEntries =
      _(stories)
        .filter(story => story.current_state === 'rejected')
        .map(storyAttributes)
        .value();
    const inProgressEntries =
      _(stories)
        .filter(story => story.current_state === 'started')
        .map(storyAttributes)
        .value();
    const readyForReviewEntries =
      _(pullRequests)
        .map(pullRequest => {
          return {
            title: pullRequest.title,
            url: pullRequest.html_url,
            authors: pullRequest.user.login,
            estimate: 0
          };
        })
        .value();
    const mergedEntries =
      _(stories)
        .filter(story => story.current_state === 'finished')
        .map(storyAttributes)
        .value();
    const deliveredEntries =
      _(stories)
        .filter(story => story.current_state === 'delivered')
        .map(storyAttributes)
        .value();
    const acceptedEntries =
      _(stories)
        .filter(story => story.current_state === 'accepted')
        .map(storyAttributes)
        .value();

    return (
      <div style={{overflow: 'scroll', whiteSpace: 'nowrap'}}>
        <SwimLane title='Unstarted' entries={unstartedEntries} />
        <SwimLane title='Rejected' entries={rejectedEntries} />
        <SwimLane title='In Progress' entries={inProgressEntries} />
        <SwimLane title='Ready for Review' entries={readyForReviewEntries} />
        <SwimLane title='Merged' entries={mergedEntries} />
        <SwimLane title='Delivered' entries={deliveredEntries} />
        <SwimLane title='Accepted' entries={acceptedEntries} />
      </div>
    );
  }
});

export default Board;
