import React from 'react';
import { Link } from 'react-router';

const HeaderBar = React.createClass({
  propTypes: {
    projectName: React.PropTypes.string.isRequired
  },

  render() {
    const styles = {
      headerBar: {
        height: 35,
        backgroundColor: '#3B3D5F',
        paddingLeft: 20,
        clear: 'both'
      },
      projectName: {
        fontFamily: "'Open Sans', helvetica, arial, sans-serif",
        fontSize: 16,
        fontWeight: 'bold',
        color: '#f6f6f6',
        paddingTop: 8,
        float: 'left',
        paddingLeft: 15
      },
      logo: {
        float: 'left',
        paddingTop: 6
      },
      settings: {
        float: 'right',
        color: '#f6f6f6',
        paddingTop: 6,
        paddingRight: 15
      }
    }
    return (
      <div style={styles.headerBar}>
        <img src={require('../img/swim.png')} style={styles.logo} />
        <div style={styles.projectName}>{this.props.projectName}</div>
        <Link style={styles.settings} to='settings'>
          <img src={require('../img/settings.png')} height={20} />
        </Link>
      </div>
    );
  }
});

export default HeaderBar;
