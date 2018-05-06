const { generateToken } = require('../utils/jwt');
const { database } = require('../server');
const { getUserByEmail, createUser, validatePassword } = require('../database/user');
const uuid = require('uuid/v4');

const cookie = (req, res) => {
  if (!req.cookies.sid) {
    res.cookie('sid', uuid(), {
      httpOnly: true,
      path: '/',
      maxAge: 24 * 7 * 3600000, // 1 week
    });

    res.json({ success: true });
  } else {
    res.json({});
  }
};

const signin = async (req, res) => {
  const data = req.body;
  if (!data) {
    return res.status(403).send('Не можем авторизировать пользователя с такими данными.');
  }

  const user = await getUserByEmail(database, data.email);

  if (!user) {
    return res.status(403).send('Нет такого пользователя. Проверьте введенные данные.');
  }

  if (validatePassword(data.password, user)) {
    delete user.password;

    return res.cookie('token', generateToken(user), {
      httpOnly: true,
      path: '/',
      maxAge: 24 * 7 * 3600000, // 1 week
    });
  } else {
    return res.status(403).send('Неверный email или пароль.');
  }
};
const signup = async (req, res) => {
  const data = req.body;
  if (!data) {
    return res.status(403).send('Не можем зарегестрировать пользователя с такими данными.');
  }

  const user = await getUserByEmail(database, data.email);

  if (user) {
    return res.status(400).send('Пользователь с таким email уже есть. Попробуйте другой.');
  }

  const newUser = await createUser(database, data);

  if (newUser) {
    return res.cookie('token', generateToken(user), {
      httpOnly: true,
      path: '/',
      maxAge: 24 * 7 * 3600000, // 1 week
    });
  } else {
    return res.status(500).send('Произошла неизвестная ошибка при создании пользователя.');
  }
};

module.exports = {
  signin,
  signup,
  cookie,
};
