const mysql = require('mysql2/promise');

const createDatabaseIfNotExists = async () => {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '12345678',
  });
  await connection.query(`CREATE DATABASE IF NOT EXISTS mystore`);

  console.log('✅ Database ensured');

  connection.end();
};

const run = async () => {
  try {
    await createDatabaseIfNotExists();

    await product();

    console.log('🚀 Seeding started ...\n');
    await seeder();

    console.log('\n🎉 All done!');
    // eslint-disable-next-line n/no-process-exit
    process.exit(0);
  } catch (err) {
    console.error('❌ Setup failed:', err.message);
    // eslint-disable-next-line n/no-process-exit
    process.exit(1);
  }
};

run();
