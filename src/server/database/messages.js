const { ObjectId } = require('mongodb');
const { pageableCollection } = require('./helpers');
const { getUser } = require('./user');
const { getRoom } = require('./room');

const TABLE = 'messages';

/**
 * @typedef {{
 *  [_id]: string,
 *  userId: string,
 *  roomId: string,
 *  created_at: number
 * }} Message
 */

/**
 * @param {Db} db
 * @param {string} userId
 * @param {string} roomId
 * @param {string} message
 *
 * @return {Promise<Message>}
 */
async function sendMessage(db, { userId, roomId, message }) {
  if (!userId) {
    throw new Error('userId required');
  }

  if (!roomId) {
    throw new Error('roomId required');
  }

  if (!message) {
    throw new Error('Cannot send empty message');
  }

  let [user, room] = await Promise.all([getUser(db, userId), getRoom(db, roomId)]);

  if (!user) {
    throw new Error(`Cannot find user with id=${userId}`);
  }

  if (!room) {
    throw new Error(`Cannot find room with id=${roomId}`);
  }

  let messageEntity = {
    userId: user._id,
    roomId: room._id,
    message,
    created_at: Date.now(),
  };

  let result = await db.collection(TABLE).insertOne(messageEntity);
  messageEntity._id = result.insertedId;

  return messageEntity;
}

/**
 * @param {Db} db
 * @param {{}} [filter]
 *
 * @return {Promise<Pagination<Message>>}
 */
async function getMessages(db, filter) {
  ['roomId', 'userId'].forEach(key => {
    if (filter[key]) {
      filter[key] = ObjectId(filter[key].toString());
    }
  });

  return pageableCollection(db.collection(TABLE), {
    ...filter,
    order: {
      id: -1,
    },
  });
}

module.exports = {
  sendMessage,
  getMessages,
};
