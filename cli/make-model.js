const fs = require('fs');
const path = require('path');

const input = process.argv[2];

if (!input) {
  console.error('Please provide a model name (e.g. user or admin/user)');
  process.exit(1);
}

const toPascalCase = (str) =>
  str
    .toLowerCase()
    .replace(/(^\w|[-_]\w)/g, (s) => s.replace(/[-_]/, '').toUpperCase());

const parts = input.split('/');
const rawName = parts.pop();
const modelName = toPascalCase(rawName);
const folderPath = path.join(process.cwd(), 'models', ...parts);
const filePath = path.join(folderPath, `${modelName}.js`);

fs.mkdirSync(folderPath, { recursive: true });

if (fs.existsSync(filePath)) {
  console.error(`Model already exists: ${path.relative(process.cwd(), filePath)}`);
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