import React from 'react';
import './message.css';

const formatOptions = {
  hour: 'numeric',
  minute: 'numeric',
};

const formatter = new Intl.DateTimeFormat('ru-RU', formatOptions);

export const Message = ({
  isMy,
  text,
  time,
  isSelected,
  isRead,
  onClick,
  status = 'sent',
}) => {
  const date = new Date(time);
  const timeFormatted = formatter.format(date);
  return (
    <div
      onClick={onClick}
      className={`message-wrapper ${isMy ? 'message-wrapper_my' : ''} ${
        isSelected && isMy ? 'message-wrapper_my_highlighted' : ''
      } ${isSelected && !isMy ? 'message-wrapper_highlighted' : ''} ${
        !isRead && isMy ? 'message-wrapper_my_highlighted' : ''
      } ${!isRead && !isMy ? 'message-wrapper_highlighted' : ''}`}
    >
      <div className={`message ${isMy ? 'message_my' : ''}`}>
        {text}
        <span className="message__time">{timeFormatted}</span>
      </div>
    </div>
  );
};
