import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import Project from '../components/Project/Project';
import Loading from '../components/shared/Loading';
import _ from 'lodash';
import fetchData from '../lib/fetchData';
import { getSettings } from '../utils/settings';

import * as sessionActions from '../redux/actions/session';


class ProjectContainer extends React.Component {
  static propTypes = {
    isLoggedIn: PropTypes.bool.isRequired,
    logoutUser: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      projectName: null,
      entries: null,
      error: false
    };
  }

  componentDidMount() {
    fetchData().then(({ projectName, entries }) => {
      this.setState({ projectName, entries });
    });
  }

  render() {
    let { projectName, entries, error } = this.state;
    let loading = (_.isEmpty(projectName) || _.isEmpty(entries)) && !error;
    const { selectedRepo } = getSettings;
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
            hasSelectedRepo={hasSelectedRepo}
            logoutUser={this.props.logoutUser}
            isLoggedIn={this.props.isLoggedIn} />
        )
      )
    );
  }
};

const mapStateToProps = ({ session }) => ({
  isLoggedIn: session.currentUser !== null
});

const mapDispatchToProps = dispatch => ({
  logoutUser: () => dispatch(sessionActions.logout())
});

export default connect(mapStateToProps, mapDispatchToProps)(ProjectContainer);

