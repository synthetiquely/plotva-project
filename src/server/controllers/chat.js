const { findUserByToken, getUsers } = require('../database/user');
const {
  joinRoom,
  leaveRoom,
  getRooms,
  getUserRooms,
  createRoom,
} = require('../database/room');
const {
  getMessages,
  getLastMessage,
  removeMessage,
  sendMessage,
  updateMessage,
} = require('../database/messages');
const TYPES = require('../messages');

/**
 * @param {Db} db
 * @param {*} io
 */

module.exports = function(db, io) {
  const ONLINE = {};

  function fillUsersWithStatus(users) {
    users.items = users.items.map(user => ({
      ...user,
      online: Boolean(ONLINE[user._id]),
    }));

    return users;
  }

  async function identifyUserByToken(db, token) {
    if (token) {
      return await findUserByToken(db, token);
    } else {
      return null;
    }
  }

  io.on('connection', async function(socket) {
    let { token } = socket.request.cookies;
    let isDisconnected = false;
    let currentUser;

    socket.join('broadcast');

    if (token) {
      currentUser = await identifyUserByToken(db, token).catch(error => {
        throw new Error(`Cannot load user: ${error}`);
      });

      if (!isDisconnected) {
        ONLINE[currentUser._id] = true;
      }
      userChangeOnlineStatus(currentUser._id);
      let rooms = await getUserRooms(db, currentUser._id);
      rooms.items.forEach(room => {
        joinToRoomChannel(db, room._id);
      });
    }

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

    function userChangeOnlineStatus(userId) {
      return socket.broadcast.emit(TYPES.ONLINE, {
        status: ONLINE[userId],
        userId,
      });
    }

    function joinToRoomChannel(roomId) {
      socket.join('room:' + roomId);
    }

    function leaveRoomChannel(roomId) {
      socket.leave('room:' + roomId);
    }

    function userWasJoinedToRoom({ userId, roomId }) {
      socket.to('room:' + roomId).emit(TYPES.USER_JOINED, { userId, roomId });
    }

    function userLeaveRoom({ userId, roomId }) {
      socket.to('room:' + roomId).emit(TYPES.USER_LEAVED, { userId, roomId });
    }

    function newMessage(message) {
      socket.to('room:' + message.roomId).emit(TYPES.MESSAGE, message);
    }

    function readMessage(message) {
      socket.to('room:' + message.roomId).emit(TYPES.MESSAGE_READ, message);
    }

    function deleteMessage({ roomId, messageId }) {
      socket
        .to('room:' + roomId)
        .emit(TYPES.MESSAGES_DELETED, { roomId, messageId });
    }

    requestResponse(TYPES.CURRENT_USER, () => currentUser);

    requestResponse(TYPES.USERS, async params => {
      return fillUsersWithStatus(await getUsers(db, params || {}));
    });

    requestResponse(TYPES.CREATE_ROOM, async params => {
      return createRoom(db, currentUser, params);
    });

    requestResponse(TYPES.ROOMS, params => {
      return getRooms(db, params || {});
    });

    requestResponse(TYPES.CURRENT_USER_ROOMS, async params => {
      if (currentUser && currentUser._id) {
        return getUserRooms(db, currentUser._id, params);
      } else {
        let { token } = socket.request.cookies;
        if (token) {
          const currentUser = await identifyUserByToken(db, token).catch(
            error => {
              throw new Error(`Cannot load user: ${error}`);
            },
          );
          return getUserRooms(db, currentUser._id, params);
        }
      }
    });

    requestResponse(TYPES.CURRENT_USER_JOIN_ROOM, async ({ roomId }) => {
      let payload = {
        roomId,
        userId: currentUser._id,
      };

      joinToRoomChannel(roomId);
      userWasJoinedToRoom(payload);

      return joinRoom(db, payload);
    });

    requestResponse(TYPES.USER_JOIN_ROOM, payload => {
      joinToRoomChannel(payload.roomId);
      userWasJoinedToRoom(payload);

      return joinRoom(db, payload);
    });

    requestResponse(TYPES.CURRENT_USER_LEAVE_ROOM, async ({ roomId }) => {
      let payload = {
        roomId,
        userId: currentUser._id,
      };

      leaveRoomChannel(roomId);
      userLeaveRoom(payload);

      return leaveRoom(db, payload);
    });

    requestResponse(TYPES.SEND_MESSAGE, async payload => {
      let message = await sendMessage(db, {
        ...payload,
        userId: currentUser._id,
        isRead: false,
      });
      newMessage(message);
      return message;
    });

    requestResponse(TYPES.DELETE_MESSAGE, async payload => {
      const result = await removeMessage(db, payload);
      deleteMessage(payload);
      return result;
    });

    requestResponse(TYPES.READ_MESSAGE, async payload => {
      if (payload.message.userId === currentUser._id) {
        return;
      } else {
        const message = await updateMessage(db, payload.message);
        readMessage(message);
        return message;
      }
    });

    requestResponse(TYPES.MESSAGES, payload => getMessages(db, payload));

    requestResponse(TYPES.GET_LAST_MESSAGE, payload =>
      getLastMessage(db, payload),
    );

    socket.on('disconnect', async () => {
      isDisconnected = true;
      if (currentUser) {
        ONLINE[currentUser._id] = false;

        userChangeOnlineStatus(currentUser._id);
      }
    });
  });
};
