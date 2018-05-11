import {
  MESSAGES_SET,
  MESSAGES_APPENDED,
  MESSAGE_SELECTED,
  MESSAGE_DELETED,
} from './actionTypes';
import chatApi from '../../api/chat';
import { transformMessages } from '../../utils/transormations';

export const setMessages = payload => ({
  type: MESSAGES_SET,
  payload,
});

export const appendMessages = payload => ({
  type: MESSAGES_APPENDED,
  payload,
});

export const selectMessage = payload => ({
  type: MESSAGE_SELECTED,
  payload,
});

export const deleteMessage = payload => ({
  type: MESSAGE_DELETED,
  payload,
});

export const updateMessage = payload => (dispatch, getState) => {
  const room = getState().messages[payload.roomId];
  if (room && room.messages.length) {
    const messagesToUpdate = room.messages.map(message => {
      if (message.id === payload.message.id) {
        return payload.message;
      } else {
        return message;
      }
    });

    if (messagesToUpdate.length) {
      dispatch(
        setMessages({
          roomId: payload.roomId,
          messages: messagesToUpdate,
          next: room.next,
        }),
      );
    }
  }
};

export const readMessages = roomId => async (dispatch, getState) => {
  const room = getState().messages[roomId];
  const currentUserId = getState().user.user._id;
  if (room) {
    const notReadMessages = room.messages.filter(message => !message.isRead);
    if (notReadMessages.length) {
      const updatedMessages = await Promise.all(
        notReadMessages.map(async notReadMessages => {
          return await chatApi.readMessage(roomId, notReadMessages);
        }),
      );
      const messagesToUpdate = room.messages.map(message => {
        for (let i = 0; i < updatedMessages.length; i++) {
          if (message.id === updatedMessages[i]._id) {
            return transformMessages(updatedMessages[i], currentUserId);
          }
        }
        return message;
      });

      if (messagesToUpdate.length) {
        dispatch(
          setMessages({ roomId, messages: messagesToUpdate, next: room.next }),
        );
      }
    }
  }
};

export const fetchLastMessage = roomId => async (dispatch, getState) => {
  const currentUserId = getState().user.user._id;
  const response = await chatApi.getRoomLastMessage(roomId);
  if (response.length) {
    const messages = [transformMessages(response[0], currentUserId)];
    dispatch(setMessages({ roomId, messages, next: null }));
  }
};

export const fetchMessages = roomId => async (dispatch, getState) => {
  const room = getState().messages[roomId];
  const currentUserId = getState().user.user._id;
  let next = (room && room.next) || null;
  let response;
  try {
    if (next) {
      response = await chatApi.getMessages(next);
      const messages = transformMessages(response.items, currentUserId);
      dispatch(appendMessages({ roomId, messages, next: response.next }));
    } else {
      return;
    }
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const fetchMessagesForFirstTime = roomId => async (
  dispatch,
  getState,
) => {
  const currentUserId = getState().user.user._id;
  let response;
  try {
    response = await chatApi.getRoomMessages(roomId);
    const messages = response.items.map(message => ({
      id: message._id,
      text: message.message,
      time: message.created_at,
      isMy: currentUserId === message.userId,
      userId: message.userId,
      isRead: message.isRead,
    }));

    dispatch(setMessages({ roomId, messages, next: response.next }));

    if (response.next) {
      dispatch(fetchMessages(roomId));
    }
  } catch (error) {
    console.log(error);
  }
};

export const sendMessage = (roomId, messageText) => async (
  dispatch,
  getState,
) => {
  try {
    const currentUserId = getState().user.user._id;
    const response = await chatApi.sendMessage(roomId, messageText);
    const message = [transformMessages(response, currentUserId)];
    dispatch(appendMessages({ roomId, messages: message }));
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const requestMessageRemoval = (roomId, messageId) => async (
  dispatch,
  getState,
) => {
  try {
    const currentUserId = getState().user.user._id;
    const res = await chatApi.deleteMessage(roomId, messageId, currentUserId);
    if (res) {
      dispatch(deleteMessage({ roomId, messageId }));
    }
  } catch (error) {
    console.log(error);
  }
};
