import React from 'react';

import './Button.css';

export const Button = ({ txt, ...rest }) => (
  <button {...rest} className="btn">
    {txt}
  </button>
);
