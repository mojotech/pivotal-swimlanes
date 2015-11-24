import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import $ from 'jquery';
import _ from 'underscore';
import HeaderBar from './HeaderBar';
import Board from './Board';
import { CircularProgress } from 'material-ui';

const pivotalAPI = 'https://www.pivotaltracker.com/services/v5';

const Project = React.createClass({
  propTypes: {
    pivotalToken: PropTypes.string.isRequired,
    pivotalProjectId: PropTypes.string.isRequired,
    gitHubToken: PropTypes.string.isRequired,
    gitHubRepo: PropTypes.string.isRequired
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
    let { pivotalProjectId, pivotalToken } = this.props;
    $.ajax({
      url: `${pivotalAPI}/projects/${pivotalProjectId}`,
      method: 'GET',
      beforeSend: xhr => xhr.setRequestHeader('X-TrackerToken', pivotalToken)
    }).done(data =>
      this.setState({ projectName: data.name })
    ).fail(() =>
      this.setState({ errorFetchingData: true })
    );
  },

  _fetchStories() {
    let { pivotalProjectId, pivotalToken } = this.props;
    this._fetchProjectMembers()
    .then(members => {
      this._members = members;
      return $.ajax({
        url: `${pivotalAPI}/projects/${pivotalProjectId}/iterations?scope=current`,
        method: 'GET',
        beforeSend: xhr => xhr.setRequestHeader('X-TrackerToken', pivotalToken)
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
    let { gitHubToken, gitHubRepo } = this.props;
    $.ajax({
      url: `https://api.github.com/repos/${gitHubRepo}/pulls?state=open&access_token=${gitHubToken}`,
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
      url: `${pivotalAPI}/projects/${pivotalProjectId}/memberships`,
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
            <div>
              <p>Error fetching data.</p>
              <Link to='settings'>Configure Settings</Link>
            </div>
          ) : (
            <div>
              <HeaderBar projectName={projectName} />
              <Board projectName={projectName} stories={stories} pullRequests={pullRequests} />
            </div>
          )
        )}
      </div>
    );
  }
});

export default Project;
