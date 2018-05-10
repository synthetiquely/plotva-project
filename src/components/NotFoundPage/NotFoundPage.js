import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../Button/Button';

import './styles.css';

export const NotFoundPage = ({ code }) => (
  <div className="not-found">
    <p>Страница не найдена.</p>
    <Link to="/chats">
      <Button txt="Вернуться назад" />
    </Link>
  </div>
);
