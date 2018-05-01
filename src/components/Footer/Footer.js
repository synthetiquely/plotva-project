import React from 'react';
import { Link } from 'react-router-dom';
import { FooterBtn } from '../FooterBtn/FooterBtn.js';
import './Footer.css';

const chats = 'Чаты';
const contacts = 'Контакты';
const settings = 'Профиль';

export const Footer = ({ path }) => (
  <div className="footer">
    <Link to="/chats">
      <FooterBtn icon="footer-chats" description={chats} active={path === chats} />
    </Link>
    <Link to="/contacts">
      <FooterBtn icon="footer-contacts" description={contacts} active={path === contacts} />
    </Link>
    <Link to="/profile">
      <FooterBtn icon="footer-settings" description={settings} active={path === settings} />
    </Link>
  </div>
);
