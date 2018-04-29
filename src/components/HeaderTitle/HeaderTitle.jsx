import React from 'react';
import './HeaderTitle.css';

export const HeaderTitle = ({ title, subtitle }) => (
  <React.Fragment>
    <div className="header-title">{title}</div>
    {subtitle && <div className="header-subtitle">{subtitle}</div>}
  </React.Fragment>
);
