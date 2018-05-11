import { ROOMS_SET, NEW_ROOM_NAME_SET, ROOM_APPENDED } from './actionTypes';
import { fetchLastMessage } from './messagesActions';
import chatApi from '../../api/chat';
import { transformRooms } from '../../utils/transormations';

export const setRooms = payload => ({
  type: ROOMS_SET,
  payload,
});

export const appendRoom = payload => ({
  type: ROOM_APPENDED,
  payload,
});

export const setNewRoomName = payload => ({
  type: NEW_ROOM_NAME_SET,
  payload,
});

export const createRoom = room => async (dispatch, getState) => {
  const user = getState().user;
  const currentUser = user && user.user;
  if (room) {
    dispatch(fetchLastMessage(room._id));
    const roomToCreate = await transformRooms(room, currentUser);
    dispatch(appendRoom(roomToCreate));
  }
};

export const fetchRooms = () => async (dispatch, getState) => {
  const next = getState().rooms.next;
  const user = getState().user;
  const currentUser = user && user.user;

  const res = await chatApi.getCurrentUserRooms(next);
  if (res.items && res.items.length) {
    const rooms = await Promise.all(
      res.items.map(async room => {
        if (room) {
          await chatApi.currentUserJoinRoom(room._id);
          dispatch(fetchLastMessage(room._id));
          return await transformRooms(room, currentUser);
        }
      }),
    );
    dispatch(setRooms({ rooms, next }));
  }

  return res;
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
