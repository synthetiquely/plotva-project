import React from 'react';
import './Icon.css';

export const Icon = ({ type, onClick, ...rest }) => (
  <span {...rest} onClick={onClick} className={`icon icon_${type}`} />
);
