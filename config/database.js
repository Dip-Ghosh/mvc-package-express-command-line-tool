require('dotenv').config();

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
