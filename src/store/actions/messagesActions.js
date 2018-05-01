import { MESSAGES_SET, MESSAGES_APPENDED } from './actionTypes';
import api from '../../api';

export const setMessages = payload => ({
  type: MESSAGES_SET,
  payload,
});

export const appendMessages = payload => ({
  type: MESSAGES_APPENDED,
  payload,
});

export const fetchMessages = roomId => async (dispatch, getState) => {
  const room = getState().messages[roomId];
  const currentUserId = getState().user.user._id;
  const hasMessages = room && room.messages.length > 0;
  let next = (room && room.next) || null;

  if (next) {
    next = {
      ...next,
      order: { created_at: -1 },
    };
  }

  let response;
  try {
    if (!hasMessages) {
      response = await api.getRoomMessages(roomId);
      const messages = response.items.map(message => ({
        id: message._id,
        text: message.message,
        time: message.created_at,
        isMy: currentUserId === message.userId,
      }));

      dispatch(setMessages({ roomId, messages, next: response.next }));
    } else if (hasMessages && next) {
      response = await api.getMessages(next);
      const messages = response.items.map(message => ({
        id: message._id,
        text: message.message,
        time: message.created_at,
        isMy: currentUserId === message.userId,
      }));

      dispatch(appendMessages({ roomId, messages, next: response.next }));
    } else {
      return;
    }

    return response;
  } catch (error) {
    console.log(error);
  }
};

export const sendMessage = (roomId, messageText) => async (dispatch, getState) => {
  try {
    const currentUserId = getState().user.user._id;
    const response = await api.sendMessage(roomId, messageText);
    const message = [
      {
        id: response._id,
        text: response.message,
        time: response.created_at,
        isMy: currentUserId === response.userId,
      },
    ];

    dispatch(appendMessages({ roomId, messages: message }));
    return response;
  } catch (error) {
    console.log(error);
  }
};
