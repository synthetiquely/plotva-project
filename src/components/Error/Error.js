import React from 'react';
import * as errorCodes from '../../errorCodes';

import './styles.css';

const generateErrorMessage = code => {
  switch (code) {
    case errorCodes.AUTHENTICATION_ERROR:
      return 'Не можем войти с такими учетными данными. Попробуйте другое имя или пароль.';
    case errorCodes.FETCH_CONTACTS_ERROR:
      return 'An API error has occured while trying to get contacts. Try to reload the page.';
    case errorCodes.FETCH_ROOMS_ERROR:
      return 'An API error has occured while trying to get rooms. Try to reload the page.';
    case errorCodes.FETCH_MESSAGES_ERROR:
      return 'An API error has occured while trying to get messages. Try to reload the page.';
    case errorCodes.SEND_MESSAGE_ERROR:
      return 'An error has occured while trying to send a message. Try to reload the page.';
    default:
      return 'An unexpected error has occured. Try to reload the page. Try to reload the page.';
  }
};

export const Error = ({ code }) => <div className="error">{generateErrorMessage(code)}</div>;
