const { findUserByToken, getUsers } = require('../database/user');
const { joinRoom, leaveRoom, getRooms, getUserRooms, createRoom } = require('../database/room');
const { getMessages, getLastMessage, sendMessage, updateMessage } = require('../database/messages');
const TYPES = require('../messages');

/**
 * @param {Db} db
 * @param {*} io
 */

module.exports = function(db, io) {
  const ONLINE = {};

  /**
   * @param {Pagination<User>} users
   * @return {Pagination<User>}
   */
  function fillUsersWithStatus(users) {
    users.items = users.items.map(user => ({ ...user, online: Boolean(ONLINE[user._id]) }));

    return users;
  }

  async function identifyUserByToken(db, token) {
    if (token) {
      return await findUserByToken(db, token);
    } else {
      return null;
    }
  }

  /**
   * Connection is created
   */
  io.on('connection', async function(socket) {
    let { token } = socket.request.cookies;
    let isDisconnected = false;
    let currentUser;

    socket.join('broadcast');

    if (token) {
      // Load user information for next usage
      currentUser = await identifyUserByToken(db, token).catch(error => {
        throw new Error(`Cannot load user: ${error}`);
      });

      if (!isDisconnected) {
        ONLINE[currentUser._id] = true;
      }
      userChangeOnlineStatus(currentUser._id);
      // Get of user groups
      let rooms = await getUserRooms(db, currentUser._id);
      rooms.items.forEach(room => {
        joinToRoomChannel(db, room._id);
      });
    }

    /**
     * Invoke callback and handle errors
     *
     * @param callback
     */
    function wrapCallback(callback) {
      return function(...args) {
        let printErr = err => {
          console.error(err);

          socket.emit(TYPES.ERROR, {
            message: err.message,
            stack: err.stack,
          });

          throw err;
        };

        try {
          return callback(...args).catch(printErr);
        } catch (err) {
          printErr(err);
        }
      };
    }

    function requestResponse(type, callback) {
      socket.on(
        type,
        wrapCallback(async ({ id, payload }) => {
          socket.emit(type + id, await callback(payload));
        }),
      );
    }

    /**
     * Send notification to every user about status change
     *
     * @param {string} userId
     */
    function userChangeOnlineStatus(userId) {
      return socket.broadcast.emit(TYPES.ONLINE, {
        status: ONLINE[userId],
        userId,
      });
    }

    /**
     * Join to socket channel, to broadcast messages inside Room
     *
     * @param {string} roomId
     */
    function joinToRoomChannel(roomId) {
      socket.join('room:' + roomId);
    }

    /**
     * Leave socket channel
     *
     * @param {string} roomId
     */
    function leaveRoomChannel(roomId) {
      socket.leave('room:' + roomId);
    }

    /**
     * Broadcast messages inside Room about user joined
     *
     * @param {string} userId
     * @param {string} roomId
     */
    function userWasJoinedToRoom({ userId, roomId }) {
      socket.to('room:' + roomId).emit(TYPES.USER_JOINED, { userId, roomId });
    }

    /**
     * Broadcast messages inside Room about user leave
     *
     * @param {string} userId
     * @param {string} roomId
     */
    function userLeaveRoom({ userId, roomId }) {
      socket.to('room:' + roomId).emit(TYPES.USER_LEAVED, { userId, roomId });
    }

    /**
     * New message coming to room
     *
     * @param {Message} message
     */
    function newMessage(message) {
      socket.to('room:' + message.roomId).emit(TYPES.MESSAGE, message);
    }

    function readMessage(message) {
      socket.to('room:' + message.roomId).emit(TYPES.MESSAGE_READ, message);
    }

    // Receive current user information
    requestResponse(TYPES.CURRENT_USER, () => currentUser);

    // Return list of all users with
    requestResponse(TYPES.USERS, async params => {
      return fillUsersWithStatus(await getUsers(db, params || {}));
    });

    // Create room
    requestResponse(TYPES.CREATE_ROOM, async params => {
      return createRoom(db, currentUser, params);
    });

    // Create room
    requestResponse(TYPES.ROOMS, params => {
      return getRooms(db, params || {});
    });

    // Rooms of current user
    requestResponse(TYPES.CURRENT_USER_ROOMS, async params => {
      if (currentUser._id) {
        return getUserRooms(db, currentUser._id, params);
      } else {
        return null;
      }
    });

    // Join current user to room
    requestResponse(TYPES.CURRENT_USER_JOIN_ROOM, async ({ roomId }) => {
      let payload = {
        roomId,
        userId: currentUser._id,
      };

      joinToRoomChannel(roomId);
      userWasJoinedToRoom(payload);

      return joinRoom(db, payload);
    });

    // Join user to room
    requestResponse(TYPES.USER_JOIN_ROOM, payload => {
      joinToRoomChannel(payload.roomId);
      userWasJoinedToRoom(payload);

      return joinRoom(db, payload);
    });

    // Leave current user to room
    requestResponse(TYPES.CURRENT_USER_LEAVE_ROOM, async ({ roomId }) => {
      let payload = {
        roomId,
        userId: currentUser._id,
      };

      leaveRoomChannel(roomId);
      userLeaveRoom(payload);

      return leaveRoom(db, payload);
    });

    // Send message
    requestResponse(TYPES.SEND_MESSAGE, async payload => {
      let message = await sendMessage(db, {
        ...payload,
        userId: currentUser._id,
        isRead: false,
      });
      newMessage(message);
      return message;
    });

    // Send message
    requestResponse(TYPES.READ_MESSAGE, async payload => {
      if (payload.message.userId === currentUser._id) {
        return;
      } else {
        const message = await updateMessage(db, payload.message);
        readMessage(message);
        return message;
      }
    });

    // Get messages
    requestResponse(TYPES.MESSAGES, payload => getMessages(db, payload));

    // Get last messages
    requestResponse(TYPES.GET_LAST_MESSAGE, payload => getLastMessage(db, payload));

    socket.on('disconnect', async () => {
      isDisconnected = true;
      if (currentUser) {
        ONLINE[currentUser._id] = false;

        userChangeOnlineStatus(currentUser._id);
      }
    });
  });
};
