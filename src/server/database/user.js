const { ObjectId } = require('mongodb');
const { getSessionInfo, saveSessionInfo } = require('./session');
const { pageableCollection, insertOrUpdateEntity } = require('./helpers');

const TABLE = 'users';

async function findUserBySid(db, sid, user) {
  let session = await getSessionInfo(db, sid);

  if (!session.userId) {
    // Create fake user

    let user = {
      name: '',
      email: '',
      phone: '',
      isFirstLogin: true,
    };

    user = await saveUser(db, user);

    session.userId = user._id;

    await saveSessionInfo(db, session);

    return user;
  } else {
    return db.collection(TABLE).findOne({ _id: session.userId });
  }
}

async function getUser(db, userId) {
  return db.collection(TABLE).findOne(
    {
      _id: ObjectId(userId.toString()),
    },
    { password: 0 },
  );
}

async function getUserByEmail(db, email) {
  return db.collection(TABLE).findOne({ email });
}

async function saveUser(db, user) {
  if (user._id) {
    user.isFirstLogin = false;
    user._id = ObjectId(user._id.toString());
  }
  return insertOrUpdateEntity(db.collection(TABLE), user);
}

async function createUser(db, userData) {
  return insertOrUpdateEntity(db.collection(TABLE), userData);
}

async function getUsers(db, filter) {
  return pageableCollection(db.collection(TABLE), filter);
}

module.exports = {
  findUserBySid,
  getUsers,
  getUser,
  getUserByEmail,
  saveUser,
  createUser,
};
