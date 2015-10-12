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
    return {
      stories: [],
      pullRequests: [],
      fetchingStories: true,
      fetchingPullRequets: true
    };
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
      this.setState({ stories: data[0].stories })
    ).always(() =>
      this.setState({ fetchingStories: false })
    );
  },

  _fetchPullRequests() {
    const { gitHubToken } = this.props;
    $.ajax({
      url: `https://api.github.com/repos/mojotech/squadlocker/pulls?state=open&access_token=${gitHubToken}`,
    }).done(data =>
      this.setState({ pullRequests: data })
    ).always(() =>
      this.setState({ fetchingPullRequets: false })
    );
  },

  render() {
    const styles = {
      centered: { textAlign: 'center' }
    };
    const { fetchingStories, fetchingPullRequets, stories, pullRequests } = this.state;
    return (
      <div>
        <h1 style={styles.centered}>SquadLocker - Current Sprint</h1>
        {fetchingStories || fetchingPullRequets ? (
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
