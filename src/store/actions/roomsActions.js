import { ROOMS_SET, NEW_ROOM_NAME_SET } from './actionTypes';
import { fetchLastMessage } from './messagesActions';
import api from '../../api';

export const setRooms = payload => ({
  type: ROOMS_SET,
  payload,
});

export const setNewRoomName = payload => ({
  type: NEW_ROOM_NAME_SET,
  payload,
});

export const fetchRooms = () => async (dispatch, getState) => {
  const next = await getState().rooms.next;
  const res = await api.getCurrentUserRooms(next);
  const rooms = await Promise.all(
    res.items.map(async room => {
      let chatName = '';
      let status = '';
      let avatar = '';
      await api.currentUserJoinRoom(room._id);
      dispatch(fetchLastMessage(room._id));
      if (room.users.length > 2) {
        chatName = room.name || 'Групповой чат';
        status = `${room.users.length} участников`;
      } else if (room.users.length) {
        const currentUserId = getState().user.user._id;
        const otherUserId =
          room.users[0] === currentUserId ? room.users[1] : room.users[0];
        const otherUser = await api.getUser(otherUserId);
        avatar = otherUser.img;
        chatName = otherUser.name;
        status = otherUser.online ? 'в сети' : 'не в сети';
      }

      return {
        _id: room._id,
        userName: chatName,
        status,
        avatar,
        users: room.users,
      };
    }),
  );
  dispatch(setRooms({ rooms, next }));
};

export const changeOnlineStatusInRooms = (userId, status) => (
  dispatch,
  getState,
) => {
  const rooms = getState().rooms.rooms;
  const next = getState().rooms.next;

  if (rooms.length) {
    const transformedRooms = rooms.map(room => {
      if (room.users && room.users.length === 2) {
        if (room.users.find(id => id === userId)) {
          return {
            ...room,
            status: status ? 'в сети' : 'не в сети',
          };
        }
      } else {
        return room;
      }
    });
    dispatch(setRooms({ rooms: transformedRooms, next }));
  }
};
