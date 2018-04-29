const express = require('express');
const app = express();
const http = require('http').Server(app);
const attachIO = require('socket.io');
const cookieParser = require('socket.io-cookie-parser');
const cookie = require('cookie-parser');
const uuid = require('uuid/v4');
const { createReadStream, stat } = require('fs');
require('dotenv').config();

const { connect } = require('./database');
const attachController = require('./controller');

/**
 * @param {{}} serverConfig
 * @param {string} serverConfig.host Server host
 * @param {number} serverConfig.port Server port
 *
 * @param {MongoConfig} databaseConfig
 *
 * @return {Promise<void>}
 */
exports.createServer = function(serverConfig, databaseConfig) {
  return connect(databaseConfig).then(db => {
    return new Promise(resolve => {
      app.use(express.static('build'));
      app.use(cookie());

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

      let io = attachIO(http);

      io.use(cookieParser());

      attachController(db, io);

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

        resolve();
      });
    });
  });
};
