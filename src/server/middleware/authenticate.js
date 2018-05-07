const jwt = require('jsonwebtoken');
const { getUserByEmail } = require('../database/user');

const authenticateUser = async (req, res, next) => {
  const { token } = req.cookies;
  if (token) {
    try {
      const decoded = await jwt.verify(token, String(process.env.JWT_SECRET));
      if (decoded !== null) {
        const user = await getUserByEmail(req.db, decoded.email);
        if (user) {
          req.currentUser = user;
          next();
        } else {
          throw new Error('Токен не валиден');
        }
      } else {
        throw new Error('Ошибка при проверке валидности токена');
      }
    } catch (error) {
      res.status(401).send('Токен не валиден. Запрос запрещен.');
    }
  }
};

module.exports = {
  authenticateUser,
};
