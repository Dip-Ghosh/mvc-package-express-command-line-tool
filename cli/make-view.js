const fs = require('fs');
const path = require('path');

const input = process.argv[2];

if (!input) {
  console.error('Please provide a view name (e.g. users/index or admin/users/show)');
  process.exit(1);
}

const fileName = input.endsWith('.ejs') ? input : `${input}.ejs`;
const filePath = path.join(process.cwd(), 'views', fileName);
const folderPath = path.dirname(filePath);

fs.mkdirSync(folderPath, { recursive: true });

if (fs.existsSync(filePath)) {
  console.error(`View already exists: ${path.relative(process.cwd(), filePath)}`);
  process.exit(1);
}

const viewTitle = path.basename(input, '.ejs');

const content = `<h1>${viewTitle}</h1>
`;

fs.writeFileSync(filePath, content);
console.log(`View created: ${path.relative(process.cwd(), filePath)}`);