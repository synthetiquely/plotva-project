import React from 'react';
import { Link } from 'react-router-dom';
import './Contact.css';

import { Avatar } from '../Avatar/Avatar';
import { Icon } from '../Icon/Icon';

export const Contact = props => {
  const {
    avatar,
    userName,
    time,
    content,
    count,
    icon,
    onClick,
    link,
    color,
    size = 'large',
    contentType = 'message',
    checked = false,
  } = props;

  let defaultName = '';
  if (userName) {
    userName.split(' ').forEach(word => {
      defaultName += word[0];
    });
  }

  return (
    <div onClick={onClick} className={`contact contact_${size}`}>
      <Avatar avatar={avatar} size={size} checked={checked} defaultName={defaultName} color={color} />
      <div className="contact__content">
        <div className="content__header">
          <div className="content__name">{userName}</div>
          {time ? (
            <div className="content__time">
              {icon ? (
                <div className="content__icon">
                  <Icon type={icon} />
                </div>
              ) : (
                false
              )}
              {time}
            </div>
          ) : (
            false
          )}
        </div>
        <div className="content__body">
          {content ? (
            <div
              className={
                contentType === 'в сети' ? 'content__text_online' : `content__text content__text_${contentType}`
              }
            >
              {content}
            </div>
          ) : (
            false
          )}
          {count ? <div className="content__counter">{count}</div> : false}
        </div>
      </div>
      {link ? <Link to={link} /> : false}
    </div>
  );
};
