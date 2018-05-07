const express = require('express');
const attachIO = require('socket.io');
const bodyParser = require('body-parser');
const cookieParser = require('socket.io-cookie-parser');
const cookie = require('cookie-parser');
const cloudinary = require('cloudinary');
const { createReadStream, stat } = require('fs');

const app = express();
const http = require('http').Server(app);
require('dotenv').config();

const { connect } = require('./database');

const chatController = require('./controllers/chatController');
const authRouter = require('./routes/auth');
const userRouter = require('./routes/user');

exports.createServer = function(serverConfig, databaseConfig, apiProvider) {
  return connect(databaseConfig).then(db => {
    return new Promise(resolve => {
      //Cloudinary API Config
      cloudinary.config({
        cloud_name: apiProvider.cloud_name,
        api_key: apiProvider.api_key,
        api_secret: apiProvider.api_secret,
      });

      let io = attachIO(http);
      io.use(cookieParser());

      app.use(express.static('build'));
      app.use(cookie());
      app.use(bodyParser.json());
      app.use(bodyParser.urlencoded({ extended: false }));

      app.use((req, res, next) => {
        req.db = db;
        next();
      });

      app.use('/api/auth', authRouter);
      app.use('/api/user', userRouter);
      chatController(db, io);

      app.use((req, res, next) => {
        let index = 'build/index.html';
        stat(index, (err, result) => {
          if (err) {
            next();
          } else {
            createReadStream(index).pipe(res);
          }
        });
      });

      http.listen(serverConfig.port, function() {
        console.log(`API server is listening at http://${serverConfig.host}:${serverConfig.port}`);
        resolve(db);
      });
    });
  });
};
