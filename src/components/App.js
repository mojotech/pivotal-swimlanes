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
    const { pivotalProjectId } = this.props;
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
    const { pivotalProjectId } = this.props;
    $.ajax({
      url: `https://www.pivotaltracker.com/services/v5/projects/${pivotalProjectId}/iterations?scope=current`,
      method: 'GET',
      beforeSend: xhr => xhr.setRequestHeader('X-TrackerToken', this.props.pivotalToken)
    }).done(data => {
      const storiesData = _.select(data[0].stories, story => story.story_type !== 'release');
      const ownerIds = _.chain(storiesData).map(story => story.owner_ids).flatten().unique().value();
      const stories = _(storiesData)
        .map(story => {
          return {
            title: story.name,
            url: story.url,
            authors: story.owner_ids.map(id => this._mapOwnerIdToName(id)).join(', '),
            kind: story.kind,
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
    const { gitHubToken } = this.props;
    $.ajax({
      url: `https://api.github.com/repos/mojotech/squadlocker/pulls?state=open&access_token=${gitHubToken}`,
      method: 'GET'
    }).done(data => {
      this.setState({
        pullRequests: _.map(data, pullRequest => {
          return {
            title: pullRequest.title,
            url: pullRequest.html_url,
            authors: pullRequest.user.login,
            estimate: 0
          };
        })
      })
    }
    ).fail(() =>
      this.setState({ errorFetchingData: true })
    );
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
    const styles = {
      centered: { textAlign: 'center' }
    };
    const { stories, pullRequests, projectName, errorFetchingData } = this.state;
    const loading = (!errorFetchingData && (_.isNull(stories) || _.isNull(pullRequests) || _.isNull(projectName)));
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
