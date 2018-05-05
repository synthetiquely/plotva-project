const { ObjectId } = require('mongodb');
const bcryptjs = require('bcryptjs');
const { getSessionInfo, saveSessionInfo } = require('./session');
const { pageableCollection, insertOrUpdateEntity } = require('./helpers');

const TABLE = 'users';

/**
 * @typedef {{
 *  [_id]: string,
 *  name: string,
 *  email: string,
 *  phone: string,
 *  password: string,
 *  [status]: boolean
 * }} User
 */

/**
 * @param {Db} db
 * @param {string} sid Session ID
 *
 * @returns {Promise<User>}
 */
async function findUserBySid(db, sid) {
  let session = await getSessionInfo(db, sid);
  if (!session.userId) {
    let user = {
      name: '',
      email: '',
      phone: '',
      password: '',
    };
    user = await saveUser(db, user);
    session.userId = user._id;
    await saveSessionInfo(db, session);
    return user;
  } else {
    return db.collection(TABLE).findOne({ _id: session.userId });
  }
}

/**
 * @param {Db} db
 * @param {string} userId
 *
 * @returns {Promise<User>}
 */
async function getUser(db, userId) {
  return db.collection(TABLE).findOne(
    {
      _id: ObjectId(userId.toString()),
    },
    { password: 0 },
  );
}

/**
 * @param {Db} db
 * @param {string} email
 *
 * @returns {Promise<User>}
 */
async function getUserByEmail(db, email) {
  return db.collection(TABLE).findOne({ email });
}

/**
 * @param {Db} db
 * @param {User} user
 *
 * @returns {Promise<User>}
 */
async function saveUser(db, user) {
  if (user._id) {
    user._id = ObjectId(user._id.toString());
  }

  return insertOrUpdateEntity(db.collection(TABLE), user);
}

/**
 * @param {string} sid
 * @param {Db} db
 * @param {User} user
 *
 * @returns {Promise<User>}
 */
async function updateUser(sid, db, userData) {
  let user = await findUserBySid(db, sid);
  user = {
    ...user,
    ...userData,
  };
  if (user.password) {
    user.password = generatePasswordHash(user.password);
  }
  return insertOrUpdateEntity(db.collection(TABLE), user);
}

/**
 * @param {Db} db
 * @param {{}} [filter]
 *
 * @return {Promise<Pagination<User>>}
 */
async function getUsers(db, filter) {
  return pageableCollection(db.collection(TABLE), filter);
}

function validatePassword(password, user) {
  return bcryptjs.compareSync(password, user.password);
}

function generatePasswordHash(password) {
  return bcryptjs.hashSync(password, 10);
}

module.exports = {
  findUserBySid,
  getUsers,
  getUser,
  getUserByEmail,
  saveUser,
  updateUser,
  generatePasswordHash,
  validatePassword,
};
