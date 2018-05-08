import io from 'socket.io-client';
import { store } from './store/store';
import { decodeTokenAndSetUser } from './store/actions/userActions';
import * as MESSAGES from './server/messages';

class Api {
  constructor() {
    this.uniqueId = 0;

    this._connectPromise = fetch('/api/auth', { credentials: 'same-origin' })
      .then(response => response.json())
      .then(res => {
        if (res.token) {
          store.dispatch(decodeTokenAndSetUser(res.token));
        }
        return this._setupSocket();
      })
      .catch(err => {
        console.error('Auth problems: ' + err.message);

        throw err;
      });
  }

  /**
   * Await for connection
   *
   * @return {Promise<*>}
   */
  _setupSocket() {
    this.io = io();

    return new Promise(resolve => {
      this.io.on('connect', resolve);
    });
  }

  /**
   * Request data and wait response
   *
   * @param {string} type message type from MESSAGES
   * @param {*} [payload] any requested data
   *
   * @return {Promise<*>}
   * @private
   */
  async _requestResponse(type, payload) {
    await this._connectPromise;

    let id = this.uniqueId++;
    let envelop = { payload, id };

    return new Promise(resolve => {
      this.io.once(type + id, resolve);
      this.io.emit(type, envelop);
    });
  }

  /**
   * Return current user information
   *
   * @return {Promise<User>}
   */
  async getCurrentUser() {
    return this._requestResponse(MESSAGES.CURRENT_USER);
  }

  /**
   * Return all known users
   *
   * @param {{ [limit]: number, [_id]: string }} [filter] - you can pass next object here
   *
   * @return {Promise<Pagination<User>>}
   */
  async getUsers(filter) {
    return this._requestResponse(MESSAGES.USERS, filter);
  }

  /**
   * Get information about user
   *
   * @param {string} userId
   * @return {Promise<User>}
   */
  async getUser(userId) {
    return this.getUsers({ _id: userId }).then(result => result.items[0]);
  }

  /**
   * @param {Room} room
   *
   * @return {Promise<void>}
   */
  async createRoom(room) {
    return this._requestResponse(MESSAGES.CREATE_ROOM, room).then(room => {
      if (room.error) {
        throw new Error(room.error);
      }

      return room;
    });
  }

  /**
   * Return list of ALL rooms
   *
   * @param {{ [limit]: number, [_id]: string }} [filter]
   *
   * @return {Promise<Pagination<Room>>}
   */
  async getRooms(filter) {
    return this._requestResponse(MESSAGES.ROOMS, filter);
  }

  /**
   * Return room by id
   *
   * @param {string} roomId
   *
   * @return {Promise<Room>}
   */
  async getRoom(roomId) {
    return this.getRooms({ _id: roomId }).then(result => result.items[0]);
  }

  /**
   * Return list of rooms for current user
   *
   * @param {{ limit: number }} [filter]
   *
   * @return {Promise<Pagination<Room>>}
   */
  async getCurrentUserRooms(filter) {
    return this._requestResponse(MESSAGES.CURRENT_USER_ROOMS, filter);
  }

  /**
   * Join current user to the room
   *
   * @param {string} roomId
   *
   * @return {Promise<Room>}
   */
  async currentUserJoinRoom(roomId) {
    return this._requestResponse(MESSAGES.CURRENT_USER_JOIN_ROOM, { roomId });
  }

  /**
   * Join current user to the room
   *
   * @param {string} userId
   * @param {string} roomId
   *
   * @return {Promise<Room>}
   */
  async userJoinRoom(userId, roomId) {
    return this._requestResponse(MESSAGES.USER_JOIN_ROOM, { userId, roomId });
  }

  /**
   * Current user leave the room
   *
   * @param {string} roomId
   *
   * @return {Promise<Room>}
   */
  async currentUserLeaveRoom(roomId) {
    return this._requestResponse(MESSAGES.CURRENT_USER_LEAVE_ROOM, { roomId });
  }

  /**
   * Send message to the room
   *
   * @param {string} roomId
   * @param {string} message
   *
   * @return {Promise<Message>}
   */
  async sendMessage(roomId, message) {
    return this._requestResponse(MESSAGES.SEND_MESSAGE, { roomId, message });
  }

  /**
   * Send message to the room
   *
   * @param {string} roomId
   * @param {string} message
   *
   * @return {Promise<Message>}
   */
  async readMessage(roomId, message) {
    return this._requestResponse(MESSAGES.READ_MESSAGE, { roomId, message });
  }

  /**
   * Return list of messages
   *
   * @param {{}} [filter]
   *
   * @return {Promise<Pagination<Message>>}
   */
  async getMessages(filter) {
    return this._requestResponse(MESSAGES.MESSAGES, filter);
  }

  /**
   * Return list of messages in room
   *
   * @param {{}} roomId
   *
   * @return {Promise<Pagination<Message>>}
   */
  async getRoomMessages(roomId) {
    return this.getMessages({ roomId, order: { created_at: -1 } });
  }

  async getRoomLastMessage(roomId) {
    return this._requestResponse(MESSAGES.GET_LAST_MESSAGE, roomId);
  }

  /**
   * Invoke callback, when someone change his status
   *
   * @param {function({userId: string, status: boolean})} callback
   *
   * @return Promise<void>
   */
  async onUserChangeStatus(callback) {
    await this._connectPromise;

    this.io.on(MESSAGES.ONLINE, callback);
  }

  /**
   * Invoke callback, when someone joined one of your rooms
   *
   * @param {function({userId: string, roomId: string})} callback
   *
   * @return Promise<void>
   */
  async onUserJoinedRoom(callback) {
    await this._connectPromise;

    this.io.on(MESSAGES.USER_JOINED, callback);
  }

  /**
   * Invoke callback, when someone leaved one of your rooms
   *
   * @param {function({userId: string, roomId: string})} callback
   *
   * @return Promise<void>
   */
  async onUserLeavedRoom(callback) {
    await this._connectPromise;

    this.io.on(MESSAGES.USER_LEAVED, callback);
  }

  /**
   * Invoke callback, when someone joined one of your rooms
   *
   * @param {function(Message)} callback
   *
   * @return Promise<void>
   */
  async onMessage(callback) {
    await this._connectPromise;

    this.io.on(MESSAGES.MESSAGE, callback);
  }

  async onReadMessage(callback) {
    await this._connectPromise;

    this.io.on(MESSAGES.MESSAGE_READ, callback);
  }
}

export default new Api();
