import React, { Component } from 'react';
import { Link } from 'react-router';
import { CircularProgress } from 'material-ui';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

class Loading extends Component {
  state = { timedOut: false };

  componentDidMount() {
    setTimeout(() => this.handleLoadingTimeout(), 5000);
  }

  componentWillUnmount() {
    clearTimeout();
  }

  handleLoadingTimeout() {
    this.setState({ timedOut: true });
  }

  render() {
    return (
      this.state.timedOut ?
      (<div style={{textAlign: 'center', paddingTop: '300px'}}>
        <h2>Please check your Pivotal Project</h2>
        <h4>It appears you do not have any current stories</h4>
        <Link to='/settings'>back to settings</Link>
      </div>) :
      (<div style={{textAlign: 'center', paddingTop: '300px'}}>
        <MuiThemeProvider>
          <CircularProgress mode='indeterminate' />
        </MuiThemeProvider>
      </div>)

    );
  }
};

export default Loading;
