import React from 'react';
import classnames from 'classnames';
import TextareaAutosize from 'react-autosize-textarea';

import submitIcon from './images/icon_submit_blue.png';
import './styles.css';

export const InputBar = ({ value, onSubmit, ...rest }) => {
  const getIconClasses = () => {
    return classnames('input-bar__icon', {
      'input-bar__icon_active': !!value,
    });
  };

  const onKeyDown = e => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      if (onSubmit) {
        onSubmit(e);
      }
    }
  };

  return (
    <form onSubmit={onSubmit} className="input-bar">
      <TextareaAutosize
        className="input-bar__input"
        type="text"
        placeholder="Write a message..."
        autoFocus
        autoComplete="off"
        maxRows={4}
        value={value}
        onKeyDown={onKeyDown}
        {...rest}
      />
      <button type="submit" className="input-bar__button" onClick={onSubmit}>
        <img className={getIconClasses()} src={submitIcon} alt="submit icon" />
      </button>
    </form>
  );
};
