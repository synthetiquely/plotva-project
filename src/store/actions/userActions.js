import jwtDecode from 'jwt-decode';
import * as userApi from '../../api/user';
import api from '../../api';
import { SET_USER, SET_USERS, SET_SELECTED } from './actionTypes';

export const setUser = user => ({
  type: SET_USER,
  user,
});

export const setUsers = (users, next) => ({
  type: SET_USERS,
  users,
  next,
});
export const setSelectedUsers = users => ({
  type: SET_SELECTED,
  users,
});

export const decodeTokenAndSetUser = token => {
  try {
    const decodedUser = jwtDecode(token);
    return {
      type: SET_USER,
      user: decodedUser,
    };
  } catch (error) {
    console.log('Ошибка при декодировании токена пользователя', error);
  }
};

export const updateAvatar = avatar => async dispatch => {
  const res = await userApi.updateAvatar(avatar);

  if (res.token) {
    dispatch(decodeTokenAndSetUser(res.token));
  }
};

export const updateProfile = userData => async dispatch => {
  const res = await userApi.updateProfile(userData);

  if (res.token) {
    dispatch(decodeTokenAndSetUser(res.token));
  }
};

export const logout = () => async dispatch => {
  await userApi.logout();
  dispatch(setUser(null));
};

export const fetchUsers = () => async (dispatch, getState) => {
  const next = getState().user.next;

  const res = await api.getUsers(next);

  const users = res.items.map(user => {
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

  dispatch(setUsers(users, res.next));
};
