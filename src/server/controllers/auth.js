const { generateToken } = require('../utils/jwt');
const { getUserByEmail, createUser, validatePassword } = require('../database/user');
const uuid = require('uuid/v4');

const cookie = async (req, res) => {
  if (!req.cookies.sid) {
    res.cookie('sid', uuid(), {
      httpOnly: true,
      path: '/',
      maxAge: 24 * 7 * 3600000, // 1 week
    });
  }

  const { token } = req.cookies;
  if (token) {
    res.json({
      token,
    });
  } else {
    res.json({});
  }
};

const autosignin = async (req, res) => {};

const signin = async (req, res) => {
  const data = req.body;
  if (!data) {
    return res.status(401).json({ error: 'Не можем авторизировать пользователя с такими данными.' });
  }
  const user = await getUserByEmail(req.db, data.email);

  if (!user) {
    return res.status(401).json({ error: 'Нет такого пользователя. Проверьте введенные данные.' });
  }

  if (validatePassword(data.password, user)) {
    delete user.password;

    const token = generateToken(user);

    res.cookie('token', token, {
      httpOnly: true,
      path: '/',
      maxAge: 24 * 7 * 3600000, // 1 week
    });
    res.json({ token });
  } else {
    return res.status(401).json({ error: 'Неверный email или пароль.' });
  }
};
const signup = async (req, res) => {
  const data = req.body;
  if (!data) {
    return res.status(400).json({ error: 'Не можем зарегестрировать пользователя с такими данными.' });
  }

  const user = await getUserByEmail(req.db, data.email);

  if (user) {
    return res.status(400).json({ error: 'Пользователь с таким email уже есть. Попробуйте другой.' });
  }

  const newUser = await createUser(req.db, data);

  if (newUser) {
    const token = generateToken(newUser);

    res.cookie('token', token, {
      httpOnly: true,
      path: '/',
      maxAge: 24 * 7 * 3600000, // 1 week
    });
    res.json({ token });
  } else {
    return res.status(500).json({ error: 'Произошла неизвестная ошибка при создании пользователя.' });
  }
};

module.exports = {
  autosignin,
  signin,
  signup,
  cookie,
};
