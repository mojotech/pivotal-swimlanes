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
    }).done(data =>
      this.setState({ stories: _.select(data[0].stories, story => story.story_type !== 'release') })
    ).fail(() =>
      this.setState({ errorFetchingData: true })
    );
  },

  _fetchPullRequests() {
    const { gitHubToken } = this.props;
    $.ajax({
      url: `https://api.github.com/repos/mojotech/squadlocker/pulls?state=open&access_token=${gitHubToken}`,
      method: 'GET'
    }).done(data => {
      this.setState({ pullRequests: data })
    }
    ).fail(() =>
      this.setState({ errorFetchingData: true })
    );
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
