const fs = require('fs');
const path = require('path');

const input = process.argv[2];

if (!input) {
  console.error('Please provide a seeder name (e.g. users_seeder)');
  // eslint-disable-next-line n/no-process-exit
  process.exit(1);
}

const toCamelCase = (str) => str.toLowerCase().replace(/[-_]+(.)/g, (_, c) => c.toUpperCase());
const parts = input.split('/');
const rawName = toCamelCase(parts.pop());
const fileName = rawName.endsWith('.js') ? rawName : `${rawName}.js`;
const folderPath = path.join(process.cwd(), 'database', 'seeders', ...parts);
const filePath = path.join(folderPath, fileName);

fs.mkdirSync(folderPath, { recursive: true });

if (fs.existsSync(filePath)) {
  console.error(`Seeder already exists: ${path.relative(process.cwd(), filePath)}`);
  // eslint-disable-next-line n/no-process-exit
  process.exit(1);
}

const content = `const db = require('../../utils/database');

module.exports = async () => {
  // write seeder here
};
`;

fs.writeFileSync(filePath, content);
console.log(`Seeder created: ${path.relative(process.cwd(), filePath)}`);