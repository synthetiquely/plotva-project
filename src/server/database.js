const Mongod = require('mongod');
const mongo = require('mongodb');
const { join } = require('path');

function startLocalDatabase(port) {
  let server = new Mongod({
    port,
    dbpath: join(process.cwd(), 'data'),
  });

  let close = () => {
    server.close().catch(err => {
      console.error(err);
    });
  };

  process.on('beforeExit', close);
  process.on('SIGINT', close);

  return server.open();
}

function createConnection(config) {
  return mongo.connect(createDatabaseUri(config)).then(client => {
    return client.db(config.database);
  });
}

function createDatabaseUri(config) {
  return `mongodb://${config.user}:${config.password}@${config.host}:${
    config.port
  }/${config.database}`;
}

function connect(config) {
  if (config.local) {
    return startLocalDatabase(config.port).then(() => createConnection(config));
  } else {
    return createConnection(config);
  }
}

module.exports = {
  connect,
  createDatabaseUri,
};
