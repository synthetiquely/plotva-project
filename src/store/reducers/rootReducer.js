import { combineReducers } from 'redux';
import { userReducer } from './userReducer';
import { messagesReducer } from './messagesReducer';
import { searchReducer } from './searchReducer';
import { roomsReducer } from './roomsReducer';

export const rootReducer = combineReducers({
  user: userReducer,
  messages: messagesReducer,
  search: searchReducer,
  rooms: roomsReducer,
});
