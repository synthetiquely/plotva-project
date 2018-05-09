import { SET_USER, SET_USERS, SET_SELECTED } from '../actions/actionTypes';

export const userReducer = (
  state = { users: [], selectedUsers: [], next: null },
  action,
) => {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        user: action.user,
      };
    case SET_USERS:
      return {
        ...state,
        users: action.users,
        next: action.next,
      };
    case SET_SELECTED:
      return {
        ...state,
        selectedUsers: action.users,
      };
    default:
      return state;
  }
};
