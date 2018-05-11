import io from 'socket.io-client';
import { store } from '../store/store';
import { decodeTokenAndSetUser } from '../store/actions/userActions';
import * as MESSAGES from '../server/messages';
import { registerSocketEventListeners } from '../registerSocketEventListeners';

class Api {
  constructor() {
    this.uniqueId = 0;
    this.auth();
  }

  auth() {
    this._connectPromise = fetch('/api/auth', { credentials: 'same-origin' })
      .then(response => response.json())
      .then(res => {
        if (res.token) {
          store.dispatch(decodeTokenAndSetUser(res.token));
          this._setupSocket();
          registerSocketEventListeners(store);
        }
      })
      .catch(err => {
        console.error('Auth problems: ' + err.message);

        throw err;
      });
  }

  _setupSocket() {
    this.io = io();

    return new Promise(resolve => {
      this.io.on('connect', resolve);
    });
  }

  async _requestResponse(type, payload) {
    await this._connectPromise;

    let id = this.uniqueId++;
    let envelop = { payload, id };

    return new Promise(resolve => {
      this.io.once(type + id, resolve);
      this.io.emit(type, envelop);
    });
  }

  async getCurrentUser() {
    return this._requestResponse(MESSAGES.CURRENT_USER);
  }

  async getUsers(filter) {
    return this._requestResponse(MESSAGES.USERS, filter);
  }

  async getUser(userId) {
    return this.getUsers({ _id: userId }).then(result => result.items[0]);
  }

  async createRoom(room) {
    return this._requestResponse(MESSAGES.CREATE_ROOM, room).then(room => {
      if (room.error) {
        throw new Error(room.error);
      }

      return room;
    });
  }

  async getRooms(filter) {
    return this._requestResponse(MESSAGES.ROOMS, filter);
  }

  async getRoom(roomId) {
    return this.getRooms({ _id: roomId }).then(result => result.items[0]);
  }

  async getCurrentUserRooms(filter) {
    return this._requestResponse(MESSAGES.CURRENT_USER_ROOMS, filter);
  }

  async currentUserJoinRoom(roomId) {
    return this._requestResponse(MESSAGES.CURRENT_USER_JOIN_ROOM, { roomId });
  }

  async userJoinRoom(userId, roomId) {
    return this._requestResponse(MESSAGES.USER_JOIN_ROOM, { userId, roomId });
  }

  async currentUserLeaveRoom(roomId) {
    return this._requestResponse(MESSAGES.CURRENT_USER_LEAVE_ROOM, { roomId });
  }

  async sendMessage(roomId, message) {
    return this._requestResponse(MESSAGES.SEND_MESSAGE, { roomId, message });
  }

  async readMessage(roomId, message) {
    return this._requestResponse(MESSAGES.READ_MESSAGE, { roomId, message });
  }

  async deleteMessage(roomId, messageId, userId) {
    return this._requestResponse(MESSAGES.DELETE_MESSAGE, {
      roomId,
      messageId,
      userId,
    });
  }

  async getMessages(filter) {
    return this._requestResponse(MESSAGES.MESSAGES, filter);
  }

  async getRoomMessages(roomId) {
    return this.getMessages({ roomId, order: { created_at: -1 } });
  }

  async getRoomLastMessage(roomId) {
    return this._requestResponse(MESSAGES.GET_LAST_MESSAGE, roomId);
  }

  async onUserChangeStatus(callback) {
    await this._connectPromise;

    this.io.on(MESSAGES.ONLINE, callback);
  }

  async onUserJoinedRoom(callback) {
    await this._connectPromise;

    this.io.on(MESSAGES.USER_JOINED, callback);
  }

  async onUserLeavedRoom(callback) {
    await this._connectPromise;

    this.io.on(MESSAGES.USER_LEAVED, callback);
  }

  async onMessage(callback) {
    await this._connectPromise;

    this.io.on(MESSAGES.MESSAGE, callback);
  }

  async onDeleteMessage(callback) {
    await this._connectPromise;

    this.io.on(MESSAGES.MESSAGES_DELETED, callback);
  }

  async onReadMessage(callback) {
    await this._connectPromise;

    this.io.on(MESSAGES.MESSAGE_READ, callback);
  }
}

export default new Api();
