import { MESSAGES_SET, MESSAGES_APPENDED, MESSAGE_SELECTED } from '../actions/actionTypes';

const initialState = {
  selectedMessage: null,
};

export const messagesReducer = (state = initialState, action) => {
  switch (action.type) {
    case MESSAGE_SELECTED:
      return {
        ...state,
        selectedMessage: action.payload,
      };
    case MESSAGES_SET:
      return {
        ...state,
        [action.payload.roomId]: {
          messages: [...action.payload.messages],
          next: action.payload.next,
        },
      };
    case MESSAGES_APPENDED:
      if (state[action.payload.roomId] && state[action.payload.roomId].messages.length > 0) {
        return {
          ...state,
          [action.payload.roomId]: {
            ...state[action.payload.roomId],
            messages: [...state[action.payload.roomId].messages, ...action.payload.messages],
            next: action.payload.next,
          },
        };
      }
      return {
        ...state,
        [action.payload.roomId]: {
          messages: [...action.payload.messages],
          next: null,
        },
      };
    default:
      return state;
  }
};
