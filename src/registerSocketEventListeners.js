import chatApi from './api/chat';
import {
  appendMessages,
  updateMessage,
  deleteMessage,
} from './store/actions/messagesActions';
import { changeOnlineStatusInRooms } from './store/actions/roomsActions';
import { transformMessages } from './utils/transormations';

export const registerSocketEventListeners = async store => {
  await chatApi.onMessage(result => {
    const currentUserId = store.getState().user.user._id;
    const message = [transformMessages(result, currentUserId)];

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

  await chatApi.onDeleteMessage(result => {
    store.dispatch(deleteMessage(result));
  });

  await chatApi.onReadMessage(result => {
    const currentUserId = store.getState().user.user._id;
    const message = transformMessages(result, currentUserId);

    store.dispatch(
      updateMessage({
        roomId: result.roomId,
        message,
      }),
    );
  });

  await chatApi.onUserChangeStatus(result => {
    store.dispatch(changeOnlineStatusInRooms(result.userId, result.status));
  });
};
