import React, { PropTypes } from 'react';
import { Link } from 'react-router';
const Cog = require('react-icons/lib/fa/cog');
const Filter = require('react-icons/lib/fa/filter');

const HeaderBar = ({ projectName, sidebarVisible }) => {
  const styles = {
    headerBar: {
      height: 50,
      backgroundColor: '#0094D9',
      clear: 'both',
      position: 'absolute',
      top: 0,
      left: sidebarVisible ? 220 : 0,
      right: 0,
      bottom: 0
    },
    projectName: {
      fontFamily: "'Open Sans', helvetica, arial, sans-serif",
      fontSize: 18,
      fontWeight: 400,
      color: '#f6f6f6',
      float: 'left',
      marginLeft: 20
    },
    logo: {
      float: 'left',
      marginLeft: 14
    },
    button: {
      float: 'left',
      paddingLeft: 15,
      paddingRight: 15,
      cursor: 'pointer',
      height: 50,
      color: '#f6f6f6',
      outline: 'none'
    },
    settingsIcon: {
      color: '#f6f6f6',
      height: 20,
      width: 20
    },
    filterIcon: {
      height: 20,
      width: 20
    },
    barsButton: {
      border: 'none',
      background: 'none'
    },
    verticalAlign: {
      position: 'relative',
      top: '50%',
      transform: 'translateY(-50%)'
    },
    divider: {
      float: 'left',
      height: 50,
      borderRight: '2px solid #0086CE'
    },
    caret: {
      display: 'inline',
      marginLeft: 6
    }
  };
  return (
    <div style={styles.headerBar}>
      <img src={require('./img/swim.png')} style={{...styles.logo, ...styles.verticalAlign }} />
      <div style={{...styles.projectName, ...styles.verticalAlign}}>
        {projectName}
      </div>
      <div style={{float: 'right'}}>
        <div style={{...styles.divider, float: 'left'}} />
        <div style={{...styles.button}} to='filter' onClick={() => alert('Filtering stories coming soon!')}>
          <Filter style={{...styles.filterIcon, ...styles.verticalAlign }} />
        </div>
        <div style={{...styles.divider, float: 'left'}} />
        <Link style={{...styles.button}} to='settings'>
          <Cog style={{...styles.settingsIcon, ...styles.verticalAlign }} />
        </Link>
      </div>
    </div>
  );
};

HeaderBar.propTypes = {
  projectName: PropTypes.string.isRequired,
  sidebarVisible: PropTypes.bool.isRequired,
  onToggleSidebar: PropTypes.func.isRequired
};

export default HeaderBar;
