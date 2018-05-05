import { ROOMS_SET, NEW_ROOM_NAME_SET } from '../actions/actionTypes';

const defaultState = {
  next: null,
  rooms: [],
  newRoomName: '',
};

export const roomsReducer = (state = defaultState, action) => {
  switch (action.type) {
    case ROOMS_SET:
      return {
        ...state,
        rooms: [...action.payload.rooms],
        next: action.payload.next,
      };
    case NEW_ROOM_NAME_SET:
      return {
        ...state,
        newRoomName: action.payload,
      };
    default:
      return state;
  }
};
