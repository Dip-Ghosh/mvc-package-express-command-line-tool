const fs = require('fs');
const path = require('path');
const db = require('../utils/database');

const migrationsPath = path.join(__dirname, 'migrations');
const seedersPath = path.join(__dirname, 'seeders');

const getMigrationFiles = () => {
  return fs
    .readdirSync(migrationsPath)
    .filter((file) => file.endsWith('.js'))
    .sort();
};

const runMigrations = async () => {
  const files = getMigrationFiles();

  for (const file of files) {
    const migration = require(path.join(migrationsPath, file));
    console.log(`Running migration: ${file}`);
    await migration.up();
  }
};

const rollbackMigrations = async () => {
  const files = getMigrationFiles().reverse();

  for (const file of files) {
    const migration = require(path.join(migrationsPath, file));
    if (typeof migration.down === 'function') {
      console.log(`Rolling back: ${file}`);
      await migration.down();
    }
  }
};

const freshMigrations = async () => {
  await db.execute('SET FOREIGN_KEY_CHECKS = 0');
  await rollbackMigrations();
  await db.execute('SET FOREIGN_KEY_CHECKS = 1');
};

const runSeeders = async () => {
  const seederFiles = fs
    .readdirSync(seedersPath)
    .filter((file) => file.endsWith('.js'))
    .sort();

  for (const file of seederFiles) {
    const seeder = require(path.join(seedersPath, file));
    console.log(`Running seeder: ${file}`);
    await seeder();
  }
};

const command = process.argv[2];
const withSeed = process.argv.includes('--seed');

const main = async () => {
  try {
    if (command === 'fresh') {
      console.log('Dropping all tables from migrations...');
      await freshMigrations();
      console.log('Re-running migrations...');
      await runMigrations();
    } else if (command === 'rollback') {
      await rollbackMigrations();
    } else {
      await runMigrations();
    }

    if (withSeed) {
      await runSeeders();
    }

    console.log('Done');
    // eslint-disable-next-line n/no-process-exit
    process.exit(0);
  } catch (error) {
    console.error('Migration error:', error.message);
    // eslint-disable-next-line n/no-process-exit
    process.exit(1);
  }
};

main();
