const { ObjectId } = require('mongodb');
const { pageableCollection, insertOrUpdateEntity } = require('./helpers');
const { getUser } = require('./user');
const { getRoom } = require('./room');

const TABLE = 'messages';

async function sendMessage(db, { userId, roomId, message, isRead }) {
  if (!userId) {
    throw new Error('userId required');
  }

  if (!roomId) {
    throw new Error('roomId required');
  }

  if (!message) {
    throw new Error('Cannot send empty message');
  }

  let [user, room] = await Promise.all([
    getUser(db, userId),
    getRoom(db, roomId),
  ]);

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
    isRead,
    created_at: Date.now(),
  };

  let result = await db.collection(TABLE).insertOne(messageEntity);
  messageEntity._id = result.insertedId;

  return messageEntity;
}

async function updateMessage(db, { id }) {
  if (!id) {
    throw new Error('Message ID required');
  }

  let message = await db
    .collection(TABLE)
    .findOne({ _id: ObjectId(id.toString()) });

  if (!message) {
    throw new Error(`Cannot find message with id=${id}`);
  }

  let messageEntity = {
    ...message,
    isRead: true,
  };
  return insertOrUpdateEntity(db.collection(TABLE), messageEntity);
}

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

async function getLastMessage(db, roomId) {
  return db
    .collection(TABLE)
    .find({ roomId: ObjectId(roomId.toString()) })
    .sort({ _id: -1 })
    .limit(1)
    .toArray();
}

module.exports = {
  sendMessage,
  updateMessage,
  getMessages,
  getLastMessage,
};
