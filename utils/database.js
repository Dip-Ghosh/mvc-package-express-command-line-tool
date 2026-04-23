const mysql = require('mysql2/promise');
const { Pool } = require('pg');
const mongoose = require('mongoose');
const cassandra = require('cassandra-driver');
const Redis = require('ioredis');

const databaseConfig = require('../config/database');

const instances = {};

const connection = async (name = databaseConfig.default) => {
  if (instances[name]) {
    return instances[name];
  }

  const config = databaseConfig.connections[name];

  if (!config) {
    throw new Error(`Database connection '${name}' is not configured.`);
  }

  switch (config.driver) {
    case 'mysql':
      instances[name] = mysql.createPool({
        host: config.host,
        port: config.port,
        user: config.username,
        password: config.password,
        database: config.database,
        multipleStatements: true,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
      });
      return instances[name];

    case 'pgsql':
      instances[name] = new Pool({
        host: config.host,
        port: config.port,
        user: config.username,
        password: config.password,
        database: config.database,
        ssl: config.ssl ? { rejectUnauthorized: false } : false,
      });
      return instances[name];

    case 'mongodb':
      instances[name] = await mongoose.createConnection(config.uri).asPromise();
      return instances[name];

    case 'cassandra':
      instances[name] = new cassandra.Client({
        contactPoints: config.contactPoints,
        localDataCenter: config.localDataCenter,
        keyspace: config.keyspace,
      });
      return instances[name];

    case 'redis':
      instances[name] = new Redis({
        host: config.host,
        port: config.port,
        password: config.password || undefined,
      });
      return instances[name];

    default:
      throw new Error(`Driver '${config.driver}' is not supported.`);
  }
};

const defaultConnection = async () => connection();

const close = async (name) => {
  const instance = instances[name];
  if (!instance) return;

  const config = databaseConfig.connections[name];

  switch (config.driver) {
    case 'mysql':
    case 'pgsql':
      await instance.end();
      break;

    case 'mongodb':
      await instance.close();
      break;

    case 'cassandra':
      await instance.shutdown();
      break;

    case 'redis':
      await instance.quit();
      break;
  }

  delete instances[name];
};

const closeAll = async () => {
  const names = Object.keys(instances);

  for (const name of names) {
    await close(name);
  }
};

module.exports = {
  connection,
  defaultConnection,
  close,
  closeAll,
};
