import React from 'react';
import { CircularProgress } from 'material-ui';

const Loading = () => (
  <div style={{textAlign: 'center'}}>
    <CircularProgress mode='indeterminate' />
  </div>
);

export default Loading;
