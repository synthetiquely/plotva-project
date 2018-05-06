const jwt = require('jsonwebtoken');
const { database } = require('../server');
const { getUserByEmail } = require('../database/user');

const authenticateUser = async (req, res, next) => {
  const authorizationHeader = req.headers['authorization'];

  let token;
  if (authorizationHeader) {
    token = authorizationHeader.split(' ')[1];
  }

  if (token) {
    try {
      const decoded = await jwt.verify(token, String(process.env.JWT_SECRET));
      if (decoded !== null) {
        const user = await getUserByEmail(database, decoded.email);
        if (user) {
          next();
        } else {
          throw new Error('Токен не валиден');
        }
      } else {
        throw new Error('Ошибка при проверке валидности токена');
      }
    } catch (error) {
      res.status(403).send('Токен не валиден. Запрос запрещен.');
    }
  }
};

module.exports = {
  authenticateUser,
};
