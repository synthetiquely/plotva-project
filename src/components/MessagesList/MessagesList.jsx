import React from 'react';
import { Message } from '../Message/Message';
import './messagesList.css';

export const MessagesList = ({ messages, selectedMessage, handleSelectMessage }) => (
  <div className="messages-list">
    {messages.map(message => (
      <Message
        key={message.id}
        {...message}
        isSelected={selectedMessage && selectedMessage.id === message.id}
        onClick={handleSelectMessage(message)}
      />
    ))}
  </div>
);
