import api from './api';
import { appendMessages, updateMessage } from './store/actions/messagesActions';
import { changeOnlineStatusInRooms } from './store/actions/roomsActions';

export const registerSocketEventListeners = async store => {
  await api.onMessage(result => {
    console.log('message to append', result);
    const message = [
      {
        id: result._id,
        text: result.message,
        time: result.created_at,
        isMy: store.getState().user.user._id === result.userId,
        userId: result.userId,
        isRead: result.isRead,
      },
    ];

    try {
      new Notification('New message', {
        body: result.message,
        icon: '/favicon.ico',
      });
    } catch (error) {
      console.log('Notification error', error);
    }

    store.dispatch(
      appendMessages({
        roomId: result.roomId,
        messages: message,
      }),
    );
  });

  await api.onReadMessage(result => {
    const message = {
      id: result._id,
      text: result.message,
      time: result.created_at,
      isMy: store.getState().user.user._id === result.userId,
      userId: result.userId,
      isRead: result.isRead,
    };

    store.dispatch(
      updateMessage({
        roomId: result.roomId,
        message,
      }),
    );
  });

  await api.onUserJoinedRoom(result => {});

  await api.onUserChangeStatus(result => {
    store.dispatch(changeOnlineStatusInRooms(result.userId, result.status));
  });
};
