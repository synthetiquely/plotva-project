import api from './api';
import { appendMessages } from './store/actions/messagesActions';

export const registerSocketEventListeners = async store => {
  await api.onMessage(result => {
    const message = [
      {
        id: result._id,
        text: result.message,
        time: result.created_at,
        isMy: store.getState().user._id === result.userId,
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
};
