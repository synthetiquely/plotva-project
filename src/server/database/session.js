const { insertOrUpdateEntity } = require('./helpers');

const TABLE = 'sessions';

function getSessionInfo(db, sid) {
  return db
    .collection(TABLE)
    .findOne({ sid })
    .then(result => result || { sid });
}

async function saveSessionInfo(db, session) {
  return insertOrUpdateEntity(db.collection(TABLE), session);
}

module.exports = {
  getSessionInfo,
  saveSessionInfo,
};
