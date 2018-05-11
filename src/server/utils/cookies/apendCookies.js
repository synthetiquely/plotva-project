const apendCookies = (res, type, value) => {
  return res.cookie(type, value, {
    httpOnly: true,
    path: '/',
    maxAge: 24 * 7 * 3600000, // 1 week
  });
};

module.exports = {
  apendCookies,
};
