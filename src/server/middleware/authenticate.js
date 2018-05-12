const { findUserBySid } = require('../database/user');

const authenticateUser = async (req, res, next) => {
  const { sid } = req.cookies;
  if (sid) {
    try {
      const user = await findUserBySid(req.db, sid);
      if (user) {
        req.currentUser = user;
        next();
      } else {
        throw new Error('Токен не валиден');
      }
    } catch (error) {
      res.status(401).send('Токен не валиден. Запрос запрещен.');
    }
  }
};

module.exports = {
  authenticateUser,
};
