import { ROOMS_SET, NEW_ROOM_NAME_SET } from './actionTypes';
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
      if (room.users.length > 2) {
        chatName = room.name || 'Групповой чат';
        status = `${room.users.length} участников`;
      } else if (room.users.length) {
        const currentUserId = getState().user.user._id;
        const otherUserId = room.users[0] === currentUserId ? room.users[1] : room.users[0];
        const otherUser = await api.getUser(otherUserId);
        chatName = otherUser.name;
        status = otherUser.online ? 'в сети' : 'не в сети';
      }

      return {
        _id: room._id,
        userName: chatName,
        status,
        users: room.users,
      };
    }),
  );
  dispatch(setRooms({ rooms, next }));
};
