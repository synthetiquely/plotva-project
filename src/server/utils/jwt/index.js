const jwt = require('jsonwebtoken');

const generateToken = data => {
  return jwt.sign(data, process.env.JWT_SECRET);
};

const decodeToken = token => {
  let decoded = null;
  jwt.verify(token, String(process.env.JWT_SECRET), (err, res) => {
    if (err) {
      throw new Error('Токен не валиден');
    }
    decoded = res;
  });
  return decoded;
};

module.exports = {
  decodeToken,
  generateToken,
};
