import React from 'react';
import { Icon } from '../Icon/Icon';

import './InputGroup.css';

export const InputGroup = ({ name, label, type, value, onInputChange }) => (
  <label className={`input-wrapper input-wrapper_${type}`}>
    {type === 'file' ? <Icon type="file" /> : null} {label}
    <input
      className={`input-wrapper__input input-wrapper__input_${type}`}
      onChange={onInputChange}
      type={type}
      name={name}
      defaultValue={value}
    />
  </label>
);
