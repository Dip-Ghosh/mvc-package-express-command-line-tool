const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const root = process.cwd();

const envExamplePath = path.join(root, '.env.example');

const configDirPath = path.join(root, 'config');
const configFilePath = path.join(configDirPath, 'database.js');

const utilsDirPath = path.join(root, 'utils');
const utilsFilePath = path.join(utilsDirPath, 'database.js');

const envBaseContent = `APP_NAME=MyApp
APP_ENV=local
APP_PORT=3000

`;

const envDatabaseContent = `# Default Database Connection
DB_CONNECTION=mysql

# MySQL
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=mystore
DB_USERNAME=root
DB_PASSWORD=

# PostgreSQL
PG_HOST=127.0.0.1
PG_PORT=5432
PG_DATABASE=analytics_db
PG_USERNAME=postgres
PG_PASSWORD=
PG_SSL=false

# MongoDB
MONGO_URI=mongodb://127.0.0.1:27017/mystore

# Cassandra
CASSANDRA_CONTACT_POINTS=127.0.0.1
CASSANDRA_DATACENTER=datacenter1
CASSANDRA_KEYSPACE=mystore

# Redis
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_PASSWORD=
`;

const databaseConfigContent = `require('dotenv').config();

module.exports = {
  default: process.env.DB_CONNECTION || 'mysql',

  connections: {
    mysql: {
      driver: 'mysql',
      host: process.env.DB_HOST || '127.0.0.1',
      port: Number(process.env.DB_PORT || 3306),
      database: process.env.DB_DATABASE || 'mystore',
      username: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || '',
    },

    pgsql: {
      driver: 'pgsql',
      host: process.env.PG_HOST || '127.0.0.1',
      port: Number(process.env.PG_PORT || 5432),
      database: process.env.PG_DATABASE || 'analytics_db',
      username: process.env.PG_USERNAME || 'postgres',
      password: process.env.PG_PASSWORD || '',
      ssl: process.env.PG_SSL === 'true',
    },

    mongodb: {
      driver: 'mongodb',
      uri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mystore',
    },

    cassandra: {
      driver: 'cassandra',
      contactPoints: (process.env.CASSANDRA_CONTACT_POINTS || '127.0.0.1').split(','),
      localDataCenter: process.env.CASSANDRA_DATACENTER || 'datacenter1',
      keyspace: process.env.CASSANDRA_KEYSPACE || 'mystore',
    },

    redis: {
      driver: 'redis',
      host: process.env.REDIS_HOST || '127.0.0.1',
      port: Number(process.env.REDIS_PORT || 6379),
      password: process.env.REDIS_PASSWORD || '',
    },
  },
};
`;

const databaseUtilsContent = `const mysql = require('mysql2/promise');
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
    throw new Error(\`Database connection '\${name}' is not configured.\`);
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
      throw new Error(\`Driver '\${config.driver}' is not supported.\`);
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
`;

const ensureFileExists = (filePath, initialContent = '') => {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, initialContent);
    return true;
  }

  return false;
};

const prependIfMissing = (filePath, block, checkText) => {
  const currentContent = fs.readFileSync(filePath, 'utf-8');

  if (currentContent.includes(checkText)) {
    return false;
  }

  fs.writeFileSync(filePath, `${block}${currentContent}`);
  return true;
};

const appendIfMissing = (filePath, block, checkText) => {
  const currentContent = fs.readFileSync(filePath, 'utf-8');

  if (currentContent.includes(checkText)) {
    return false;
  }

  const separator = currentContent.endsWith('\n') ? '\n' : '\n\n';
  fs.appendFileSync(filePath, `${separator}${block}`);
  return true;
};

const installPackages = () => {
  const required = ['dotenv', 'mysql2', 'pg', 'mongoose', 'cassandra-driver', 'ioredis'];

  let installed = {};

  try {
    const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf-8'));
    installed = {
      ...(pkg.dependencies || {}),
      ...(pkg.devDependencies || {}),
    };
  } catch {
    console.log('No package.json found, skipping dependency check');
    return;
  }

  const missing = required.filter((pkg) => !installed[pkg]);

  if (missing.length === 0) {
    console.log('All required database packages are already installed');
    return;
  }

  console.log(`Installing missing packages: ${missing.join(', ')}`);
  execSync(`npm install ${missing.join(' ')}`, { stdio: 'inherit' });
  console.log('Packages installed successfully');
};

try {
  installPackages();

  const envExampleCreated = ensureFileExists(envExamplePath, envBaseContent);
  const envExampleBaseAdded = prependIfMissing(envExamplePath, envBaseContent, 'APP_NAME=');
  const envExampleDbAdded = appendIfMissing(
    envExamplePath,
    envDatabaseContent,
    '# Default Database Connection'
  );

  fs.mkdirSync(configDirPath, { recursive: true });
  fs.mkdirSync(utilsDirPath, { recursive: true });

  let configCreated = false;
  let configSkipped = false;

  if (!fs.existsSync(configFilePath)) {
    fs.writeFileSync(configFilePath, databaseConfigContent);
    configCreated = true;
  } else {
    configSkipped = true;
  }

  let utilsCreated = false;
  let utilsSkipped = false;

  if (!fs.existsSync(utilsFilePath)) {
    fs.writeFileSync(utilsFilePath, databaseUtilsContent);
    utilsCreated = true;
  } else {
    utilsSkipped = true;
  }

  if (envExampleCreated) {
    console.log('.env.example created');
  } else {
    console.log('.env.example already exists');
  }

  if (envExampleBaseAdded) {
    console.log('Base app config added to .env.example');
  }

  if (envExampleDbAdded) {
    console.log('Database variables added to .env.example');
  } else {
    console.log('Database variables already exist in .env.example');
  }

  if (configCreated) {
    console.log('config/database.js created');
  } else if (configSkipped) {
    console.log('config/database.js already exists');
  }

  if (utilsCreated) {
    console.log('utils/database.js created');
  } else if (utilsSkipped) {
    console.log('utils/database.js already exists');
  }

  console.log('Database setup completed');
} catch (error) {
  console.error('Failed to generate database setup:', error.message);
  process.exit(1);
}
