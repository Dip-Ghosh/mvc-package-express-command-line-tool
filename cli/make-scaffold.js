const { execSync } = require('child_process');
const path = require('path');

const input = process.argv[2];

if (!input) {
  console.error('Please provide a scaffold name (e.g. user or admin/user)');
  // eslint-disable-next-line n/no-process-exit
  process.exit(1);
}

const root = process.cwd();

const run = (file, name) => {
  const command = `node ${path.join('cli', file)} "${name}"`;
  execSync(command, { stdio: 'inherit', cwd: root });
};

try {
  run('make-controller.js', input);
  run('make-service.js', input);
  run('make-model.js', input);
  run('make-route.js', input);
  run('make-seeder.js', input);
  run('make-migration.js', input);

  console.log(`Scaffold created successfully for: ${input}`);
} catch (error) {
  console.error('Failed to create scaffold:', error.message);
  // eslint-disable-next-line
  process.exit(1);
}
