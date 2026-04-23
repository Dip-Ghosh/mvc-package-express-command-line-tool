const fs = require('fs');
const path = require('path');

const input = process.argv[2];

if (!input) {
  console.error('? Please provide a service name (e.g. user or admin/user)');
  // eslint-disable-next-line n/no-process-exit
  process.exit(1);
}

const toCamelCase = (str) => str.toLowerCase().replace(/[-_]+(.)/g, (_, c) => c.toUpperCase());

const normalizeName = (name) => {
  return name.endsWith('Service') ? name : name + 'Service';
};

const parts = input.split('/');
const rawName = parts.pop();

const className = normalizeName(toCamelCase(rawName));
const baseName = className.replace(/Service$/, '');
const folderPath = path.join(process.cwd(), 'services', ...parts);
const fileName = `${baseName}.service.js`;
const filePath = path.join(folderPath, fileName);

fs.mkdirSync(folderPath, { recursive: true });

if (fs.existsSync(filePath)) {
  console.error(`? Service already exists: ${filePath}`);
  // eslint-disable-next-line n/no-process-exit
  process.exit(1);
}

const content = `/**
 * ${className}
 */


const show = async (id) => {
  return '${baseName} show ' + id;
};

const store = async (payload) => {
  return '${baseName} store';
};

const update = async (id, payload) => {
  return '${baseName} update ' + id;
};

const destroy = async (id) => {
  return '${baseName} destroy ' + id;
};

module.exports = {
  show,
  store,
  update,
  destroy,
};
`;

fs.writeFileSync(filePath, content);

console.log(`Service created: ${path.relative(process.cwd(), filePath)}`);
