import React from 'react';
import './FooterBtn.css';
import { Icon } from '../Icon/Icon';

export const FooterBtn = ({ active, icon, description, onClick }) => (
  <div
    onClick={onClick}
    className={active ? 'footer-btn' : 'footer-btn_passive'}
  >
    <Icon type={icon} alt="" />
    <p className="footer-btn__description">{description}</p>
  </div>
);
