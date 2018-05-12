import {
  ROOMS_SET,
  NEW_ROOM_NAME_SET,
  ROOM_APPENDED,
  ROOMS_CLEARED,
} from '../actions/actionTypes';

const defaultState = {
  next: null,
  rooms: [],
  newRoomName: '',
};

export const roomsReducer = (state = defaultState, action) => {
  switch (action.type) {
    case ROOMS_CLEARED:
      return defaultState;
    case ROOM_APPENDED:
      return {
        ...state,
        rooms: [...state.rooms, action.payload],
      };
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
