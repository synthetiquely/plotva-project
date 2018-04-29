const { ObjectId } = require('mongodb');

const { getSessionInfo, saveSessionInfo } = require('./session');
const { pageableCollection, insertOrUpdateEntity } = require('./helpers');

const TABLE = 'users';

/**
 * @typedef {{
 *  [_id]: string,
 *  name: string,
 *  email: string,
 *  phone: string,
 *  [status]: boolean
 * }} User
 */

/**
 * @param {Db} db
 * @param {string} sid Session ID
 *
 * @returns {Promise<User>}
 */
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

/**
 * @param {Db} db
 * @param {string} userId
 *
 * @returns {Promise<User>}
 */
async function getUser(db, userId) {
  return db.collection(TABLE).findOne({ _id: ObjectId(userId.toString()) });
}

/**
 * @param {Db} db
 * @param {User} user
 *
 * @returns {Promise<User>}
 */
async function saveUser(db, user) {
  if (user._id) {
    user.isFirstLogin = false;
    user._id = ObjectId(user._id.toString());
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

module.exports = {
  findUserBySid,
  getUsers,
  getUser,
  saveUser,
};
