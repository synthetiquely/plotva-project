const { insertOrUpdateEntity } = require('./helpers');

const TABLE = 'sessions';

/**
 * @typedef {{_id: string, sid: string}} UserSession
 */

/**
 * @param {Db} db
 * @param {string} sid
 *
 * @return {Promise<UserSession>}
 */
function getSessionInfo(db, sid) {
  return db
    .collection(TABLE)
    .findOne({ sid })
    .then(result => result || { sid });
}

/**
 * @param {Db} db
 * @param {UserSession} session
 *
 * @returns {Promise}
 */
async function saveSessionInfo(db, session) {
  return insertOrUpdateEntity(db.collection(TABLE), session);
}

module.exports = {
  getSessionInfo,
  saveSessionInfo,
};
