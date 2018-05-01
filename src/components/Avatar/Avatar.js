import React from 'react';
import { colors } from './DefaultColors.js';

import './Avatar.css';

export const Avatar = ({ avatar, checked, defaultName, color = 0, size = 'large' }) => (
  <div className={`avatar avatar_${size} ${checked ? 'avatar_checked' : ''}`}>
    {avatar ? (
      <img className="avatar__img" src={avatar} alt="avatar" />
    ) : (
      <div style={{ backgroundColor: colors[color[color.length - 1]] }} className="avatar_default">
        {defaultName ? defaultName.toUpperCase() : null}
      </div>
    )}
  </div>
);
