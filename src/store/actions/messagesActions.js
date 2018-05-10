import {
  MESSAGES_SET,
  MESSAGES_APPENDED,
  MESSAGE_SELECTED,
} from './actionTypes';
import api from '../../api';

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
    const notReadMessages = room.messages.filter(
      message => !message.isRead && !message.isMy,
    );
    if (notReadMessages.length) {
      const updatedMessages = await Promise.all(
        notReadMessages.map(async notReadMessages => {
          return await api.readMessage(roomId, notReadMessages);
        }),
      );
      const messagesToUpdate = room.messages.map(message => {
        for (let i = 0; i < updatedMessages.length; i++) {
          if (message.id === updatedMessages[i]._id) {
            return {
              id: updatedMessages[i]._id,
              text: updatedMessages[i].message,
              time: updatedMessages[i].created_at,
              isMy: currentUserId === updatedMessages[i].userId,
              userId: updatedMessages[i].userId,
              isRead: updatedMessages[i].isRead,
            };
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
  const response = await api.getRoomLastMessage(roomId);
  if (response.length) {
    const messages = [
      {
        id: response[0]._id,
        text: response[0].message,
        time: response[0].created_at,
        isMy: currentUserId === response[0].userId,
        userId: response[0].userId,
        isRead: response[0].isRead,
      },
    ];
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
      response = await api.getMessages(next);
      const messages = response.items.map(message => ({
        id: message._id,
        text: message.message,
        time: message.created_at,
        isMy: currentUserId === message.userId,
        userId: message.userId,
        isRead: message.isRead,
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

export const fetchMessagesForFirstTime = roomId => async (
  dispatch,
  getState,
) => {
  const currentUserId = getState().user.user._id;
  let response;
  try {
    response = await api.getRoomMessages(roomId);
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
    const response = await api.sendMessage(roomId, messageText);
    const message = [
      {
        id: response._id,
        text: response.message,
        time: response.created_at,
        isMy: currentUserId === response.userId,
        userId: response.userId,
        isRead: response.isRead,
      },
    ];

    dispatch(appendMessages({ roomId, messages: message }));
    return response;
  } catch (error) {
    console.log(error);
  }
};
