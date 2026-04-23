const fs = require('fs');
const path = require('path');

const input = process.argv[2];

if (!input) {
  console.error('Please provide a migration name (e.g. create_table_users)');
  // eslint-disable-next-line n/no-process-exit
  process.exit(1);
}

const timestamp = new Date().toISOString().replace(/[-:TZ.]/g, '').slice(0, 14);
const toCamelCase = (str) => str.toLowerCase().replace(/[-_]+(.)/g, (_, c) => c.toUpperCase());
const fileName = `${timestamp}_${toCamelCase(input)}.js`;
const folderPath = path.join(process.cwd(), 'database', 'migrations');
const filePath = path.join(folderPath, fileName);

fs.mkdirSync(folderPath, { recursive: true });

if (fs.existsSync(filePath)) {
  console.error(`Migration already exists: ${path.relative(process.cwd(), filePath)}`);
  // eslint-disable-next-line n/no-process-exit
  process.exit(1);
}

const content = `const db = require('../../utils/database');

module.exports = {
  up: async () => {
    // write migration here
  },

  down: async () => {
    // write rollback here
  },
};
`;

fs.writeFileSync(filePath, content);
console.log(`Migration created: ${path.relative(process.cwd(), filePath)}`);