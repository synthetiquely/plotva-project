const express = require('express');
const path = require('path');
const attachIO = require('socket.io');
const bodyParser = require('body-parser');
const cookieParser = require('socket.io-cookie-parser');
const cookie = require('cookie-parser');
const cloudinary = require('cloudinary');
const uuid = require('uuid/v4');

const app = express();
const http = require('http').Server(app);
require('dotenv').config();

const { connect } = require('./database');

const chatController = require('./controllers/chat');
// const authRouter = require('./routes/auth');
const userRouter = require('./routes/user');

exports.createServer = function(serverConfig, databaseConfig, apiProvider) {
  return connect(databaseConfig).then(db => {
    return new Promise(resolve => {
      cloudinary.config({
        cloud_name: apiProvider.cloud_name,
        api_key: apiProvider.api_key,
        api_secret: apiProvider.api_secret,
      });

      let io = attachIO(http);
      io.use(cookieParser());

      app.use(express.static(path.join(global.__basedir, 'build')));
      app.use(cookie());
      app.use(bodyParser.json());
      app.use(bodyParser.urlencoded({ extended: false }));

      app.use((req, res, next) => {
        req.db = db;
        next();
      });

      app.get('/api/auth', function(req, res) {
        if (!req.cookies.sid) {
          res.cookie('sid', uuid(), {
            httpOnly: true,
            path: '/',
            maxAge: 24 * 7 * 3600000, // 1 week
          });
        }

        res.json({});
      });

      app.use('/api/user', userRouter);
      chatController(db, io);

      app.get('*', (req, res) => {
        res.sendFile(path.join(global.__basedir, 'build', 'index.html'));
      });

      http.listen(serverConfig.port, function() {
        console.log(
          `API server is listening at http://${serverConfig.host}:${
            serverConfig.port
          }`,
        );
        resolve(db);
      });
    });
  });
};
