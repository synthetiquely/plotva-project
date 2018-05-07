import React from 'react';

import './Button.css';

export const Button = ({ txt, fullWidth, ...rest }) => (
  <button {...rest} className={`btn ${fullWidth ? 'fullWidth' : ''}`}>
    {txt}
  </button>
);
