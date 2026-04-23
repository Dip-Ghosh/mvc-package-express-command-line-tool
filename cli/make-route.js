const fs = require('fs');
const path = require('path');

const input = process.argv[2];

if (!input) {
  console.error('Please provide a route name (e.g. user or admin/user)');
  // eslint-disable-next-line n/no-process-exit
  process.exit(1);
}

const toCamelCase = (str) => str.toLowerCase().replace(/[-_]+(.)/g, (_, c) => c.toUpperCase());

const parts = input.split('/');
const rawName = parts.pop();
const routeName = `${toCamelCase(rawName)}`;
const controllerName = `${toCamelCase(rawName)}Controller`;
const folderPath = path.join(process.cwd(), 'routes', ...parts);
const fileName = `${routeName}.route.js`;
const filePath = path.join(folderPath, fileName);
const routerPath = path.join(process.cwd(), 'routes', 'index.js');

fs.mkdirSync(folderPath, { recursive: true });

if (fs.existsSync(filePath)) {
  console.error(`Route already exists: ${path.relative(process.cwd(), filePath)}`);
  // eslint-disable-next-line n/no-process-exit
  process.exit(1);
}

const controllerImportPath = parts.length
  ? `../controllers/${parts.join('/')}/${controllerName}`
  : `../controllers/${controllerName}`;

const content = `const express = require('express');
const router = express.Router();
const controller = require('${controllerImportPath}');

router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', controller.store);
router.put('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;
`;

fs.writeFileSync(filePath, content);

if (!fs.existsSync(routerPath)) {
  const baseRouterContent = `
const express = require('express');
const router = express.Router();

module.exports = router;
`;

  fs.writeFileSync(routerPath, baseRouterContent);
  console.log('Base router file created: routes/index.js');
}

let routerContent = fs.readFileSync(routerPath, 'utf-8');

const routeRequirePath = parts.length ? `./${parts.join('/')}/${routeName}` : `./${routeName}`;

const importLine = `const ${routeName} = require('${routeRequirePath}');`;
const useLine = `router.use(${routeName});`;

if (!routerContent.includes(importLine)) {
  const lines = routerContent.split('\n');

  let lastRequireIndex = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('require(')) {
      lastRequireIndex = i;
    }
  }

  if (lastRequireIndex >= 0) {
    lines.splice(lastRequireIndex + 1, 0, importLine);
  } else {
    lines.unshift(importLine);
  }

  routerContent = lines.join('\n');
}

if (!routerContent.includes(useLine)) {
  const lines = routerContent.split('\n');
  const exportIndex = lines.findIndex((line) => line.includes('module.exports'));

  if (exportIndex >= 0) {
    lines.splice(exportIndex, 0, useLine);
  } else {
    lines.push(useLine);
  }

  routerContent = lines.join('\n');
}

fs.writeFileSync(routerPath, routerContent);

console.log(`Route created: ${path.relative(process.cwd(), filePath)}`);
console.log(`Route registered in: ${path.relative(process.cwd(), routerPath)}`);
