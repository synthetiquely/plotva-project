const { ObjectId } = require('mongodb');
const bcryptjs = require('bcryptjs');
const { decodeToken } = require('../utils/jwt');
const { pageableCollection, insertOrUpdateEntity } = require('./helpers');

const TABLE = 'users';

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

async function getUserByEmail(db, email) {
  return db.collection(TABLE).findOne({ email });
}

async function saveUser(db, user) {
  if (user._id) {
    user._id = ObjectId(user._id.toString());
  }

  return insertOrUpdateEntity(db.collection(TABLE), user);
}

async function createUser(db, userData) {
  if (userData.password) {
    userData.password = generatePasswordHash(userData.password);
  }
  return insertOrUpdateEntity(db.collection(TABLE), userData);
}

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
