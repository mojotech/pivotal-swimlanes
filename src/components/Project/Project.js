import React, { Component, PropTypes } from 'react';
import HeaderBar from './HeaderBar';
import Board from './Board';

class Project extends Component {
  static propTypes = {
    projectName: PropTypes.string.isRequired,
    entries: PropTypes.array.isRequired,
    hasSelectedRepo: PropTypes.bool.isRequired
  };

  state = {
    sidebarVisible: false
  };

  toggleSidebar = () => (
    this.setState({ sidebarVisible: !this.state.sidebarVisible })
  );

  render() {
    const { entries, projectName, hasSelectedRepo } = this.props;
    const { sidebarVisible } = this.state;
    return (
      <div>
        <HeaderBar
          heading={projectName}
          sidebarVisible={sidebarVisible}
          onToggleSidebar={this.toggleSidebar}
          showFilter={false}
          showSettings={true} />
        <Board
          entries={entries}
          sidebarVisible={sidebarVisible}
          hasSelectedRepo={hasSelectedRepo} />
      </div>
    );
  }
}

export default Project;
