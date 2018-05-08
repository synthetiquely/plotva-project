global.__basedir = __dirname;

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

const CLOUDINARY_CONFIG = {
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
};

createServer(SERVER_CONFIG, DATABASE_CONFIG, CLOUDINARY_CONFIG).catch(err => {
  console.log(err);
});
