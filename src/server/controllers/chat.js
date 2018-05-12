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

  function fillUsersWithStatus(users, currentUser) {
    if (currentUser) {
      ONLINE[currentUser._id] = true;
    }
    users.items = users.items.map(user => ({
      ...user,
      online: Boolean(ONLINE[user._id]),
    }));

    return users;
  }

  io.on('connection', async function(socket) {
    // let isDisconnected = false;
    let currentUser;

    socket.join('broadcast');

    async function identifyUserByToken() {
      const { token } = socket.request.cookies;
      if (token) {
        currentUser = await findUserByToken(db, token);
        if (currentUser) {
          ONLINE[currentUser._id] = true;
          userChangeOnlineStatus(currentUser._id);
          let rooms = await getUserRooms(db, currentUser._id);
          rooms.items.forEach(room => {
            joinToRoomChannel(db, room._id);
          });
        }
      } else {
        return null;
      }
    }

    currentUser = await identifyUserByToken().catch(error => {
      throw new Error(`Cannot load user: ${error}`);
    });

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
        wrapCallback(async ({ id, payload, currentUser }) => {
          socket.emit(type + id, await callback(payload, currentUser));
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

    requestResponse(TYPES.USERS, async (params, user) => {
      currentUser = user;
      if (currentUser) {
        ONLINE[currentUser._id] = true;
        userChangeOnlineStatus(currentUser._id);
      }

      return fillUsersWithStatus(await getUsers(db, params || {}), currentUser);
    });

    requestResponse(TYPES.CREATE_ROOM, async (params, user) => {
      return createRoom(db, currentUser ? currentUser : user, params);
    });

    requestResponse(TYPES.ROOMS, params => {
      return getRooms(db, params || {});
    });

    requestResponse(TYPES.CURRENT_USER_ROOMS, async (params, user) => {
      currentUser = user;
      if (currentUser) {
        ONLINE[currentUser._id] = true;
        userChangeOnlineStatus(currentUser._id);
        return getUserRooms(db, currentUser._id, params);
      } else {
        return [];
      }
    });

    requestResponse(TYPES.CURRENT_USER_JOIN_ROOM, async (params, user) => {
      let payload = {
        roomId: params.roomId,
        userId: currentUser ? currentUser._id : user._id,
      };

      joinToRoomChannel(params.roomId);
      userWasJoinedToRoom(payload);

      return joinRoom(db, payload);
    });

    requestResponse(TYPES.USER_JOIN_ROOM, payload => {
      joinToRoomChannel(payload.roomId);
      userWasJoinedToRoom(payload);

      return joinRoom(db, payload);
    });

    requestResponse(TYPES.CURRENT_USER_LEAVE_ROOM, async (params, user) => {
      let payload = {
        roomId: params.roomId,
        userId: currentUser ? currentUser._id : user._id,
      };

      leaveRoomChannel(params.roomId);
      userLeaveRoom(payload);

      return leaveRoom(db, payload);
    });

    requestResponse(TYPES.SEND_MESSAGE, async (payload, user) => {
      let message = await sendMessage(db, {
        ...payload,
        userId: currentUser ? currentUser._id : user._id,
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
      // isDisconnected = true;
      if (currentUser) {
        ONLINE[currentUser._id] = false;

        userChangeOnlineStatus(currentUser._id);
      }
    });
  });
};
