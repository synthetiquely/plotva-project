const { createServer } = require('./src/server/server');

const {
  MONGO_USER = '',
  MONGO_PASSWORD = '',
  MONGO_LOCAL = 'false',
  MONGO_DATABASE = 'yandex-messenger',
  MONGO_HOST = 'ds163119.mlab.com',
  MONGO_PORT = 63119,
  SERVER_HOST = 'localhost',
  SERVER_PORT = 3001,
} = process.env;

/**
 * Setup mongo configuration
 */
const DATABASE_CONFIG = {
  user: MONGO_USER,
  password: MONGO_PASSWORD,
  host: MONGO_HOST,
  port: MONGO_PORT,
  local: MONGO_LOCAL !== 'false',
  database: MONGO_DATABASE,
};

/**
 * Socket.io server
 */
const SERVER_CONFIG = {
  host: SERVER_HOST,
  port: SERVER_PORT,
};

createServer(SERVER_CONFIG, DATABASE_CONFIG).catch(err => {
  console.log(err);
});
