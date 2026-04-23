const fs = require('fs');
const path = require('path');

const input = process.argv[2];

if (!input) {
  console.error('Please provide a model name (e.g. user or admin/user)');
  // eslint-disable-next-line n/no-process-exit
  process.exit(1);
}

const toCamelCase = (str) => str.toLowerCase().replace(/[-_]+(.)/g, (_, c) => c.toUpperCase());
const parts = input.split('/');
const rawName = parts.pop();
const modelName = toCamelCase(rawName);
const folderPath = path.join(process.cwd(), 'models', ...parts);
const fileName = `${modelName}.model.js`;
const filePath = path.join(folderPath, fileName);

fs.mkdirSync(folderPath, { recursive: true });

if (fs.existsSync(filePath)) {
  console.error(`Model already exists: ${path.relative(process.cwd(), filePath)}`);
  // eslint-disable-next-line n/no-process-exit
  process.exit(1);
}

const content = `/**
 * ${modelName}
 */

class ${modelName} {
  constructor(data = {}) {
    Object.assign(this, data);
  }
}

module.exports = ${modelName};
`;

fs.writeFileSync(filePath, content);
console.log(`Model created: ${path.relative(process.cwd(), filePath)}`);