const Mongod = require('mongod');
const mongo = require('mongodb');
const { join } = require('path');

/**
 * @typedef {{
 *  host: string,
 *  port: number
 *  database: string
 * }} MongoConfig
 */

/**
 * Start local mongo server
 *
 * @param {number} port
 */
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

  /**
   * Kill mongo after process close
   */
  process.on('beforeExit', close);
  process.on('SIGINT', close);

  return server.open();
}

/**
 * Connect to database
 *
 * @param {MongoConfig} config
 *
 * @return {Promise<Db>}
 */
function createConnection(config) {
  return mongo.connect(createDatabaseUri(config)).then(client => {
    return client.db(config.database);
  });
}

/**
 * Create url to connect to database
 *
 * @param {MongoConfig} config
 *
 * @return {string}
 */
function createDatabaseUri(config) {
  return `mongodb://${config.user}:${config.password}@${config.host}:${config.port}/${config.database}`;
}

/**
 * Create connection to database
 *
 * @param {MongoConfig} config
 *
 * @return {Promise<MongoClient>}
 */
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
