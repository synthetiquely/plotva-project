const { ObjectId } = require('mongodb');
const bcryptjs = require('bcryptjs');
const { decodeToken } = require('../utils/jwt');
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

async function findUserByToken(db, token) {
  const decoded = decodeToken(token);
  return db.collection(TABLE).findOne(
    {
      _id: ObjectId(decoded._id.toString()),
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
async function createUser(db, userData) {
  if (userData.password) {
    userData.password = generatePasswordHash(userData.password);
  }
  return insertOrUpdateEntity(db.collection(TABLE), userData);
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
  findUserByToken,
  getUsers,
  getUser,
  getUserByEmail,
  saveUser,
  createUser,
  generatePasswordHash,
  validatePassword,
};
