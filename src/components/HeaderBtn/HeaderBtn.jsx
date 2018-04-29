import React from 'react';
import { Icon } from '../Icon/Icon';
import './HeaderBtn.css';

export const HeaderBtn = ({ txt, type, onClick }) => (
  <button onClick={onClick} className={`header-btn header-btn_${type}`}>
    {type === 'back' && <Icon type="header-back" />}
    {txt}
  </button>
);
