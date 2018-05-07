const cloudinary = require('cloudinary');
const { generateToken } = require('../utils/jwt');
const { saveUser } = require('../database/user');

const updateProfile = (req, res) => {
  const user = req.currentUser;
  if (user) {
    const userData = {
      ...user,
      ...req.body,
    };
    saveUser(req.db, userData).then(updatedUser => {
      const token = generateToken(updatedUser);
      res.cookie('token', token, {
        httpOnly: true,
        path: '/',
        maxAge: 24 * 7 * 3600000, // 1 week
      });
      res.json({ token });
    });
  } else {
    res.status(403).send('Токен не валиден. Запрос запрещен.');
  }
};

const updateAvatar = (req, res) => {
  const user = req.currentUser;
  if (user) {
    if (req.file) {
      cloudinary.uploader
        .upload_stream(result => {
          const userData = {
            ...user,
            img: result.secure_url,
          };
          saveUser(req.db, userData).then(updatedUser => {
            const token = generateToken(updatedUser);
            res.cookie('token', token, {
              httpOnly: true,
              path: '/',
              maxAge: 24 * 7 * 3600000, // 1 week
            });
            res.json({ token });
          });
        })
        .end(req.file.buffer);
    }
  } else {
    res.status(403).send('Токен не валиден. Запрос запрещен.');
  }
};

module.exports = {
  updateProfile,
  updateAvatar,
};
