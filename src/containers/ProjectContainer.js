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
            this.fetchCommits(pullRequests).then(pullRequestsWithCommits => {
              const entries = _.map(stories, story => {
                const commitsWithPivotalStoryId = _.filter(pullRequestsWithCommits, prCommits => {
                  const commitsHaveStoryId =
                    _(prCommits.commitMessages)
                      .filter(message => _.includes(message, story.id))
                      .any();
                  return commitsHaveStoryId;
                });
                const storyPullRequests =
                  _(pullRequests)
                    .filter(pullRequest => {
                      const prIds = _.pluck(commitsWithPivotalStoryId, 'pullRequestId');
                      return _.includes(prIds, pullRequest.id);
                    })
                    .map(pullRequest => ( {url:pullRequest.url, status: pullRequest.status}))
                    .value();

                return (
                  {
                    title: story.name,
                    owners: _.map(story.ownerIds, id => {
                      let owner = _.find(projectMembers, 'id', id);
                      return owner ? owner.name : null;
                    }),
                    estimate: story.estimate,
                    pullRequests: storyPullRequests,
                    trackerUrl: story.url,
                    state: _.isEmpty(storyPullRequests) ? this.storyType(story) : 'Ready for Review',
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
      _(data[0].stories)
        .filter(s => s.story_type !== 'release')
        .map(story => (
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
        .value()
    ).fail(() => this.setState({ error: true }));
  },

  fetchPullRequests() {
    let { gitHubToken, selectedRepo } = getSettings();
    return new Promise(resolve => {
      if (selectedRepo !== null && selectedRepo !== undefined) {
        $.ajax({
          url: `https://api.github.com/repos/${selectedRepo}/pulls?state=open&access_token=${gitHubToken}`,
          method: 'GET'
        }).then(data => {
          const pullRequestShas = data.map(pullRequest => pullRequest.head.sha);
          const statusRequests = pullRequestShas.map(sha => this.fetchPullRequestStatuses(sha));
          Promise.all(statusRequests).then(statuses => {
            const pullRequestData = data.map((pullRequest, i) => {
              return ({
                id: pullRequest.id,
                url: pullRequest.html_url,
                commitsUrl: pullRequest.commits_url,
                status: statuses[i]
              });
            });
            resolve(pullRequestData);
          });
        }).fail(() => {
          this.setState({ error: true });
          resolve();
        });
      } else {
        resolve();
      }
    });
  },

  fetchPullRequestStatuses(sha) {
    let { gitHubToken, selectedRepo } = getSettings();
    return new Promise(resolve => {
      if (selectedRepo !== null && selectedRepo !== undefined) {
        $.ajax({
          url: `https://api.github.com/repos/${selectedRepo}/commits/${sha}/statuses?access_token=${gitHubToken}`,
          method: 'GET'
        }).then(data => {
          const state = data.length === 0 ? null : data[0].state;
          resolve(state);  // return only the first (most recent) commit status
        }).fail(() => {
          this.setState({ error: true });
          resolve();
        });
      } else {
        resolve();
      }
    });
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
    const { selectedRepo } = getSettings();
    const hasSelectedRepo = (selectedRepo !== null && selectedRepo !== undefined);
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
          <Project
            projectName={projectName}
            entries={entries}
            hasSelectedRepo={hasSelectedRepo} />
        )
      )
    );
  }
});

export default ProjectContainer;
