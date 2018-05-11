import {
  MESSAGES_SET,
  MESSAGES_APPENDED,
  MESSAGE_SELECTED,
  MESSAGE_DELETED,
} from '../actions/actionTypes';

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
      if (
        state[action.payload.roomId] &&
        state[action.payload.roomId].messages.length > 0
      ) {
        return {
          ...state,
          [action.payload.roomId]: {
            ...state[action.payload.roomId],
            messages: [
              ...state[action.payload.roomId].messages,
              ...action.payload.messages,
            ],
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
    case MESSAGE_DELETED:
      if (
        state[action.payload.roomId] &&
        state[action.payload.roomId].messages.length > 0
      ) {
        const filteredMessages = state[action.payload.roomId].messages.filter(
          message => message.id !== action.payload.messageId,
        );
        return {
          ...state,
          [action.payload.roomId]: {
            ...state[action.payload.roomId],
            messages: filteredMessages,
          },
        };
      } else {
        return state;
      }
    default:
      return state;
  }
};
