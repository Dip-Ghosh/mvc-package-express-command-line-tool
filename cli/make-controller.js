const fs = require('fs');
const path = require('path');

const input = process.argv[2];

if (!input) {
  console.error('❌ Please provide a controller name (e.g. user or admin/user)');
  process.exit(1);
}

const toCamelCase = (str) => str.toLowerCase().replace(/[-_]+(.)/g, (_, c) => c.toUpperCase());

const normalizeName = (name) => {
  return name.endsWith('Controller') ? name : name + 'Controller';
};

const parts = input.split('/');
const rawName = parts.pop();
const className = normalizeName(toCamelCase(rawName));
const baseName = className.replace(/Controller$/, '');
const folderPath = path.join(process.cwd(), 'controllers', ...parts);
const filePath = path.join(folderPath, `${className}.js`);

fs.mkdirSync(folderPath, { recursive: true });

if (fs.existsSync(filePath)) {
  console.error(`❌ Controller already exists: ${filePath}`);
  process.exit(1);
}

const content = `/**
 * ${className}
 */

const index = async (req, res) => {
  return res.send('${baseName} index');
};

const show = async (req, res) => {
  return res.send('${baseName} show');
};

const store = async (req, res) => {
  return res.send('${baseName} store');
};

const update = async (req, res) => {
  return res.send('${baseName} update');
};

const destroy = async (req, res) => {
  return res.send('${baseName} destroy');
};

module.exports = {
  index,
  show,
  store,
  update,
  destroy,
};
`;

fs.writeFileSync(filePath, content);

console.log(`✅ Controller created: ${path.relative(process.cwd(), filePath)}`);