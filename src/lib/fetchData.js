import $ from 'jquery';
import _ from 'lodash';
import { getSettings } from '../settings';

const pivotalAPI = 'https://www.pivotaltracker.com/services/v5';

const {
  selectedPivotalProjectId,
  pivotalToken,
  gitHubToken,
  selectedRepo
} = getSettings;

export default async function() {
  return new Promise( async function(resolve) {
    const projectName = await fetchProjectName();
    const projectMembers = await fetchProjectMembers();
    const stories = await fetchStories();
    const pullRequests = await fetchPullRequests();
    const pullRequestsWithCommits = await fetchCommits(pullRequests);
    const entries = formatEntries(
      stories,
      pullRequestsWithCommits,
      pullRequests,
      projectMembers
    );
    resolve({ projectName, entries });
  });
}

function storyType(story) {
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
}

function formatEntries(stories, pullRequestsWithCommits, pullRequests, projectMembers) {
  return _.map(stories, story => {
    const commitsWithPivotalStoryId = _.filter(pullRequestsWithCommits, prCommits => {
      const commitsHaveStoryId =
        _.some(_.filter(prCommits.commitMessages, message => _.includes(message, story.id)));
      return commitsHaveStoryId;
    });
    const storyPullRequests =
      _(pullRequests)
        .filter(pullRequest => {
          const prIds = _.map(commitsWithPivotalStoryId, 'pullRequestId');
          return _.includes(prIds, pullRequest.id);
        })
        .map(pullRequest => ( {url:pullRequest.url, status: pullRequest.status}))
        .value();

    return ({
      title: story.name,
      owners: _.map(story.ownerIds, id => {
        let owner = _.find(projectMembers, 'id', id);
        return owner ? owner.name : null;
      }),
      estimate: story.estimate,
      pullRequests: storyPullRequests,
      trackerUrl: story.url,
      state: _.isEmpty(storyPullRequests) ? storyType(story) : 'Ready for Review',
      type: story.type
    });
  });
}

async function fetchProjectName() {
  return $.ajax({
    url: `${pivotalAPI}/projects/${selectedPivotalProjectId}`,
    method: 'GET',
    beforeSend: xhr => xhr.setRequestHeader('X-TrackerToken', pivotalToken)
  }).then(data =>
    data.name
  ).fail(() => {
    throw new Error();
  });
}

async function fetchStories() {
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
  ).fail(() => {
    throw new Error();
  });
}

async function fetchPullRequests() {
  return new Promise(resolve => {
    if (selectedRepo !== null && selectedRepo !== undefined) {
      $.ajax({
        url: `https://api.github.com/repos/${selectedRepo}/pulls?state=open&access_token=${gitHubToken}`,
        method: 'GET'
      }).then(data => {
        const pullRequestShas = data.map(pullRequest => pullRequest.head.sha);
        const statusRequests = pullRequestShas.map(sha => fetchPullRequestStatuses(sha));
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
        throw new Error();
      });
    } else {
      resolve();
    }
  });
}

function fetchPullRequestStatuses(sha) {
  return new Promise(resolve => {
    if (selectedRepo !== null && selectedRepo !== undefined) {
      $.ajax({
        url: `https://api.github.com/repos/${selectedRepo}/commits/${sha}/statuses?access_token=${gitHubToken}`,
        method: 'GET'
      }).then(data => {
        const state = data.length === 0 ? null : data[0].state;
        resolve(state);  // return only the first (most recent) commit status
      }).fail(() => {
        throw new Error();
      });
    } else {
      resolve();
    }
  });
}

function fetchCommits(pullRequests) {
  let urls = _.map(pullRequests, 'commitsUrl');
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
        commitMessages: _(commits).map('commit').map('message').value()
      }
    ))
  );
}

function fetchProjectMembers() {
  return $.ajax({
    url: `${pivotalAPI}/projects/${selectedPivotalProjectId}/memberships`,
    method: 'GET',
    beforeSend: xhr => xhr.setRequestHeader('X-TrackerToken', pivotalToken)
  }).then(data =>
    _.map(data, item => ({ id: item.person.id, name: item.person.name }))
  ).fail(() => {
    throw new Error();
  });
}
