import React from 'react';
import * as errorCodes from '../../errorCodes';

import './styles.css';

const generateErrorMessage = code => {
  switch (code) {
    case errorCodes.AUTHENTICATION_ERROR:
      return 'Не можем войти с такими учетными данными. Попробуйте другое имя или пароль.';
    case errorCodes.FETCH_CONTACTS_ERROR:
      return 'Не можем получить список контактов. Попробуйте перезагрузить страницу.';
    case errorCodes.FETCH_ROOMS_ERROR:
      return 'Не можем получить список чатов. Попробуйте перезагрузить страницу.';
    case errorCodes.FETCH_MESSAGES_ERROR:
      return 'Не можем получить список сообщений. Попробуйте перезагрузить страницу.';
    case errorCodes.SEND_MESSAGE_ERROR:
      return 'Не можем отправить сообщение сейчас. Попробуйте позже';
    case errorCodes.UPDATE_USER_ERROR:
      return 'Произошла ошибка при обновлении пользователя. Попробуйте еще раз позже.';
    default:
      return 'Произошла неизвестная ошибка. Попробуйте перезагрузить страницу.';
  }
};

export const Error = ({ code }) => <div className="error">{generateErrorMessage(code)}</div>;
