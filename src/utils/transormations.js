import chatApi from '../api/chat';

export const transformMessages = (messages, currentUserId) => {
  if (messages.length) {
    return messages.map(message => ({
      id: message._id,
      text: message.message,
      time: message.created_at,
      isMy: currentUserId === message.userId,
      userId: message.userId,
      isRead: message.isRead,
    }));
  } else {
    const transformed = {
      id: messages._id,
      text: messages.message,
      time: messages.created_at,
      isMy: currentUserId === messages.userId,
      userId: messages.userId,
      isRead: messages.isRead,
    };

    return transformed;
  }
};

export const transformRooms = async (rooms, currentUser) => {
  let chatName = '';
  let status = '';
  let avatar = '';
  if (rooms.users.length > 2) {
    chatName = rooms.name || 'Групповой чат';
    status = `${rooms.users.length} участников`;
  } else if (rooms.users.length === 2) {
    const otherUserId =
      rooms.users[0] === currentUser._id ? rooms.users[1] : rooms.users[0];
    const otherUser = await chatApi.getUser(otherUserId);
    avatar = otherUser.img;
    chatName = otherUser.name;
    status = otherUser.online ? 'в сети' : 'не в сети';
  } else if (rooms.users.length) {
    avatar = currentUser ? currentUser.img : '';
    chatName = 'Вы';
    status = 'Сохраненные сообщения';
  }

  return {
    _id: rooms._id,
    userName: chatName,
    status,
    avatar,
    users: rooms.users,
  };
};

export const transformUsers = users =>
  users.map(user => {
    const status = user.online ? 'в сети' : 'не в сети';
    return {
      _id: user._id,
      userName: user.name ? user.name : 'Аноним',
      avatar: user.img,
      size: 'small',
      content: status,
      contentType: status,
    };
  });
