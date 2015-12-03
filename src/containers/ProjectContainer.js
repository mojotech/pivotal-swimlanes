import React from 'react';
import { Link } from 'react-router';
import Project from '../components/Project/Project';
import Loading from '../components/shared/Loading';
import { getSettings } from '../settings';
import $ from 'jquery';
import _ from 'lodash';

const pivotalAPI = 'https://www.pivotaltracker.com/services/v5';

const ProjectContainer = React.createClass({
  getInitialState() {
    return {
      projectName: null,
      entries: null,
      error: false
    };
  },

  componentDidMount() {
    this.fetchData();
  },

  fetchData() {
    this.fetchProjectName().then(projectName => {
      this.fetchProjectMembers().then(projectMembers => {
        this.fetchStories().then(stories => {
          this.fetchPullRequests().then(pullRequests => {
            this.fetchCommits(pullRequests).then(commits => {
              let entries = _.map(stories, story => {
                let commitWithPivotalStoryId = _.find(
                  commits,
                  prCommits => _.find(prCommits.commitMessages, message => _.includes(message, story.id))
                );
                let reviewUrl = commitWithPivotalStoryId ? (
                  _.find(pullRequests, 'id', commitWithPivotalStoryId.pullRequestId).url
                ) : null;
                return (
                  {
                    title: story.name,
                    owners: _.map(story.ownerIds, id => {
                      let owner = _.find(projectMembers, 'id', id);
                      return owner ? owner.name : id.toString();
                    }),
                    estimate: story.estimate,
                    reviewUrl,
                    trackerUrl: story.url,
                    state: _.isEmpty(reviewUrl) ? this.storyType(story) : 'Ready for Review',
                    type: story.type
                  }
                );
              });
              this.setState({ projectName, entries });
            });
          });
        });
      });
    });
  },

  storyType(story) {
    switch (story.state) {
    case 'unstarted':
    case 'planned':
      return 'Unstarted';

    case 'started':
    case 'rejected':
      return 'In Progress';

    case 'Ready for Review':
      return 'Ready for Review';

    case 'finished':
      return 'Merged';

    case 'delivered':
      return 'Delivered';

    case 'accepted':
      return 'Accepted';

    default:
      return story.state;
    }
  },

  fetchProjectName() {
    let { selectedPivotalProjectId, pivotalToken } = getSettings();
    return $.ajax({
      url: `${pivotalAPI}/projects/${selectedPivotalProjectId}`,
      method: 'GET',
      beforeSend: xhr => xhr.setRequestHeader('X-TrackerToken', pivotalToken)
    }).then(data =>
      data.name
    ).fail(() =>
      this.setState({ error: true })
    );
  },

  fetchStories() {
    let { selectedPivotalProjectId, pivotalToken } = getSettings();
    return $.ajax({
      url: `${pivotalAPI}/projects/${selectedPivotalProjectId}/iterations?scope=current`,
      method: 'GET',
      beforeSend: xhr => xhr.setRequestHeader('X-TrackerToken', pivotalToken)
    }).then(data =>
      _.map(data[0].stories, story => (
        {
          id: story.id,
          state: story.current_state,
          name: story.name,
          type: story.story_type,
          url: story.url,
          ownerIds: story.owner_ids,
          estimate: story.estimate
        }
      ))
    ).fail(() => this.setState({ error: true }));
  },

  fetchPullRequests() {
    let { gitHubToken, selectedRepo } = getSettings();
    return $.ajax({
      url: `https://api.github.com/repos/${selectedRepo}/pulls?state=open&access_token=${gitHubToken}`,
      method: 'GET'
    }).then(data =>
      _.map(data, pullRequest => (
        {
          id: pullRequest.id,
          url: pullRequest.html_url,
          commitsUrl: pullRequest.commits_url
        }
      ))
    ).fail(() => this.setState({ error: true }));
  },

  fetchCommits(pullRequests) {
    let { gitHubToken } = getSettings();
    let urls = _.pluck(pullRequests, 'commitsUrl');
    let requests = _.map(urls, url =>
      $.ajax({
        url: `${url}?access_token=${gitHubToken}`,
        method: 'GET'
      })
    );
    return Promise.all(requests).then(data =>
      _.map(data, (commits, i) => (
        {
          pullRequestId: pullRequests[i].id,
          commitMessages: _(commits).pluck('commit').pluck('message').value()
        }
      ))
    );
  },

  fetchProjectMembers() {
    let { selectedPivotalProjectId, pivotalToken } = getSettings();
    return $.ajax({
      url: `${pivotalAPI}/projects/${selectedPivotalProjectId}/memberships`,
      method: 'GET',
      beforeSend: xhr => xhr.setRequestHeader('X-TrackerToken', pivotalToken)
    }).then(data =>
      _.map(data, item => ({ id: item.person.id, name: item.person.name }))
    ).fail(() => this.setState({ error: true }));
  },

  render() {
    let { projectName, entries, error } = this.state;
    let loading = (_.isEmpty(projectName) || _.isEmpty(entries)) && !error;
    return (
      loading ? (
        <Loading />
      ) : (
        error ? (
          <div>
            <p>Error fetching data.</p>
            <Link to='settings'>Configure Settings</Link>
          </div>
        ) : (
          <Project projectName={projectName} entries={entries} />
        )
      )
    );
  }
});

export default ProjectContainer;
