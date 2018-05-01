import React from 'react';
import TextareaAutosize from 'react-autosize-textarea';
import submitIcon from './images/icon_submit.png';
import './styles.css';

export const InputBar = ({ value, onSubmit, ...rest }) => {
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
        placeholder="Написать сообщение..."
        autoFocus
        autoComplete="off"
        maxRows={4}
        value={value}
        onKeyDown={onKeyDown}
        {...rest}
      />
      <button type="submit" className="input-bar__button" onClick={onSubmit}>
        <img className="input-bar__icon" src={submitIcon} alt="submit icon" />
      </button>
    </form>
  );
};
