import React from 'react';
import $ from 'jquery';
import _ from 'underscore';
import Board from './Board';
import { CircularProgress } from 'material-ui';

const App = React.createClass({
  propTypes: {
    pivotalToken: React.PropTypes.string.isRequired,
    pivotalProjectId: React.PropTypes.string.isRequired,
    gitHubToken: React.PropTypes.string.isRequired
  },

  getInitialState() {
    return { stories: null, pullRequests: null, projectName: null };
  },

  componentDidMount() {
    this._fetchProjectName();
    this._fetchStories();
    this._fetchPullRequests();
  },

  _fetchProjectName() {
    let { pivotalProjectId } = this.props;
    $.ajax({
      url: `https://www.pivotaltracker.com/services/v5/projects/${pivotalProjectId}`,
      method: 'GET',
      beforeSend: xhr => xhr.setRequestHeader('X-TrackerToken', this.props.pivotalToken)
    }).done(data =>
      this.setState({ projectName: data.name })
    ).fail(() =>
      this.setState({ errorFetchingData: true })
    );
  },

  _fetchStories() {
    let { pivotalProjectId } = this.props;
    this._fetchProjectMembers()
    .then(members => {
      this._members = members;
      return $.ajax({
        url: `https://www.pivotaltracker.com/services/v5/projects/${pivotalProjectId}/iterations?scope=current`,
        method: 'GET',
        beforeSend: xhr => xhr.setRequestHeader('X-TrackerToken', this.props.pivotalToken)
      });
    }).done(data => {
      let storiesData = _.select(data[0].stories, story => story.story_type !== 'release');
      let ownerIds = _.chain(storiesData).map(story => story.owner_ids).flatten().unique().value();
      let stories = _(storiesData)
        .map(story => {
          return {
            title: story.name,
            url: story.url,
            authors: story.owner_ids.map(id => this._mapOwnerIdToName(id)).join(', '),
            type: story.story_type,
            estimate: story.estimate || 0,
            current_state: story.current_state
          };
        });
      this.setState({ stories: stories });
    }).fail(() =>
      this.setState({ errorFetchingData: true })
    );
  },

  _fetchPullRequests() {
    let { gitHubToken, gitHubUser, gitHubRepo } = this.props;
    $.ajax({
      url: `https://api.github.com/repos/${gitHubUser}/${gitHubRepo}/pulls?state=open&access_token=${gitHubToken}`,
      method: 'GET'
    }).done(data => {
      this.setState({
        pullRequests: _.map(data, pullRequest => {
          return {
            title: pullRequest.title,
            url: pullRequest.html_url,
            authors: pullRequest.user.login,
            estimate: 0,
            type: 'pr'
          };
        })
      })
    }
    ).fail(() =>
      this.setState({ errorFetchingData: true })
    );
  },

  _fetchProjectMembers() {
    let { pivotalProjectId, pivotalToken } = this.props;
    return $.ajax({
      url: `https://www.pivotaltracker.com/services/v5/projects/${pivotalProjectId}/memberships`,
      method: 'GET',
      beforeSend: xhr => xhr.setRequestHeader('X-TrackerToken', pivotalToken)
    });
  },

  _mapOwnerIdToName(id) {
    return _.first(_.filter(this._members, member => member.person.id === id)).person.name;
  },

  render() {
    let styles = {
      centered: { textAlign: 'center' }
    };
    let { stories, pullRequests, projectName, errorFetchingData } = this.state;
    let loading = (!errorFetchingData && (_.isNull(stories) || _.isNull(pullRequests) || _.isNull(projectName)));
    return (
      <div>
        {loading ? (
          <div style={styles.centered}>
            <CircularProgress mode='indeterminate' />
          </div>
        ) : (
          errorFetchingData ? (
            <div>Error fetching data.</div>
          ) : (
            <div>
              <h1 style={styles.centered}>{projectName} Sprint</h1>
              <Board projectName={projectName} stories={stories} pullRequests={pullRequests} />
            </div>
          )
        )}
      </div>
    );
  }
});

export default App;
