import React from 'react';
import SwimLane from './SwimLane';
import _ from 'lodash';

const Board = React.createClass({
  propTypes: {
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
    const unstartedEntries =
      _(stories)
        .filter(story => story.current_state === 'unstarted' || story.current_state === 'planned')
        .map(story => {
          return {
            title: story.name,
            url: story.url,
            authors: story.owner_ids.map(id => this._mapOwnerIdToName(id)).join(', ')
          };
        })
        .value();
    const rejectedEntries =
      _(stories)
        .filter(story => story.current_state === 'rejected')
        .map(story => {
          return {
            title: story.name,
            url: story.url,
            authors: story.owner_ids.map(id => this._mapOwnerIdToName(id)).join(', ')
          };
        })
        .value();
    const inProgressEntries =
      _(stories)
        .filter(story => story.current_state === 'started')
        .map(story => {
          return {
            title: story.name,
            url: story.url,
            authors: story.owner_ids.map(id => this._mapOwnerIdToName(id)).join(', ')
          };
        })
        .value();
    const readyForReviewEntries =
      _(pullRequests)
        .map(pullRequest => {
          return {
            title: pullRequest.title,
            url: pullRequest.html_url,
            authors: pullRequest.user.login
          };
        })
        .value();
    const mergedEntries =
      _(stories)
        .filter(story => story.current_state === 'finished')
        .map(story => {
          return {
            title: story.name,
            url: story.url,
            authors: story.owner_ids.map(id => this._mapOwnerIdToName(id)).join(', ')
          };
        })
        .value();
    const deliveredEntries =
      _(stories)
        .filter(story => story.current_state === 'delivered')
        .map(story => {
          return {
            title: story.name,
            url: story.url,
            authors: story.owner_ids.map(id => this._mapOwnerIdToName(id)).join(', ')
          };
        })
        .value();
    const acceptedEntries =
      _(stories)
        .filter(story => story.current_state === 'accepted')
        .map(story => {
          return {
            title: story.name,
            url: story.url,
            authors: story.owner_ids.map(id => this._mapOwnerIdToName(id)).join(', ')
          };
        })
        .value();

    return (
      <div style={{overflowX: 'scroll'}}>
        <div style={{whiteSpace: 'nowrap'}}>
          <SwimLane title='Unstarted' entries={unstartedEntries} />
          <SwimLane title='Rejected' entries={rejectedEntries} />
          <SwimLane title='In Progress' entries={inProgressEntries} />
          <SwimLane title='Ready for Review' entries={readyForReviewEntries} />
          <SwimLane title='Merged' entries={mergedEntries} />
          <SwimLane title='Delivered' entries={deliveredEntries} />
          <SwimLane title='Accepted' entries={acceptedEntries} />
        </div>
      </div>
    );
  }
});

export default Board;
