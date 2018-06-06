import React from 'react';

export function renderErrorsFor(errors, ref) {
  if (!errors) return false;

  return errors.map((error, i) => {
    if (error[ref]) {
      return (
        <div key={i} className='error'>
          {error[ref]}
        </div>
      );
    }
  });
};
