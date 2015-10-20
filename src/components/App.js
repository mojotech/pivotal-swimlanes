import React from 'react';
import $ from 'jquery';
import Board from './Board';
import { CircularProgress } from 'material-ui';

const App = React.createClass({
  propTypes: {
    pivotalToken: React.PropTypes.string.isRequired,
    pivotalProjectId: React.PropTypes.string.isRequired,
    gitHubToken: React.PropTypes.string.isRequired
  },

  getInitialState() {
    return { stories: null, pullRequests: null };
  },

  componentDidMount() {
    this._fetchStories();
    this._fetchPullRequests();
  },

  _fetchStories() {
    const { pivotalProjectId } = this.props;
    $.ajax({
      url: `https://www.pivotaltracker.com/services/v5/projects/${pivotalProjectId}/iterations?scope=current`,
      beforeSend: xhr => xhr.setRequestHeader('X-TrackerToken', this.props.pivotalToken)
    }).done(data =>
      this.setState({ stories: _.select(data[0].stories, story => story.story_type != 'release') })
    );
  },

  _fetchPullRequests() {
    const { gitHubToken } = this.props;
    $.ajax({
      url: `https://api.github.com/repos/mojotech/squadlocker/pulls?state=open&access_token=${gitHubToken}`,
    }).done(data =>
      this.setState({ pullRequests: data })
    );
  },

  render() {
    const styles = {
      centered: { textAlign: 'center' }
    };
    const { stories, pullRequests } = this.state;
    const loading = (_.isEmpty(stories) || _.isEmpty(pullRequests));
    return (
      <div>
        <h1 style={styles.centered}>SquadLocker - Current Sprint</h1>
        {loading ? (
          <div style={styles.centered}>
            <CircularProgress mode='indeterminate' />
          </div>
        ) : (
          <Board stories={stories} pullRequests={pullRequests} />
        )}
      </div>
    );
  }
});

export default App;
