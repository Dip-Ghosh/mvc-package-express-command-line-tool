#!/usr/bin/env node

const path = require('path');
const { spawnSync } = require('child_process');

const [, , command, ...args] = process.argv;

const commands = {
  'migrate': path.join(__dirname, '../database/migrate.js'),
  'migrate:fresh': path.join(__dirname, '../database/migrate.js'),
  'migrate:fresh-seed': path.join(__dirname, '../database/migrate.js'),
  'migrate:rollback': path.join(__dirname, '../database/migrate.js'),

  'make:controller': path.join(__dirname, '../cli/make-controller.js'),
  'make:model': path.join(__dirname, '../cli/make-model.js'),
  'make:migration': path.join(__dirname, '../cli/make-migration.js'),
  'make:seeder': path.join(__dirname, '../cli/make-seeder.js'),
  'make:view': path.join(__dirname, '../cli/make-view.js'),
  'make:route': path.join(__dirname, '../cli/make-route.js'),
  'make:database': path.join(__dirname, '../cli/make-database.js'),
  'make:resource': path.join(__dirname, '../cli/make-scaffold.js'),
};

if (!command || !commands[command]) {
  console.log(`
Usage:
  node-forge migrate
  node-forge migrate:fresh
  node-forge migrate:fresh-seed
  node-forge migrate:rollback
  node-forge make:controller <name>
  node-forge make:model <name>
  node-forge make:migration <name>
  node-forge make:seeder <name>
  node-forge make:view <name>
  node-forge make:route <name>
  node-forge make:database
  node-forge make:resource <name>
`);
  process.exit(1);
}

let scriptArgs = [...args];

switch (command) {
  case 'migrate:fresh':
    scriptArgs = ['fresh', ...args];
    break;

  case 'migrate:fresh-seed':
    scriptArgs = ['fresh', '--seed', ...args];
    break;

  case 'migrate:rollback':
    scriptArgs = ['rollback', ...args];
    break;

  default:
    break;
}

const result = spawnSync('node', [commands[command], ...scriptArgs], {
  stdio: 'inherit',
  cwd: process.cwd(),
});

process.exit(result.status ?? 0);