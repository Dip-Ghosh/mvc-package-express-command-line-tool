🧹 ESLint + Prettier Setup (Modern Flat Config)

A clean, modern setup using:

ESLint v9+ (Flat Config)
Prettier
Husky + lint-staged (pre-commit enforcement)
📦 1. Install Dependencies
npm install -D eslint prettier eslint-config-prettier eslint-plugin-n globals

eslint-plugin-n is the modern replacement for eslint-plugin-node.

⚙️ 2. ESLint Config (eslint.config.js)
import pluginN from "eslint-plugin-n";
import configPrettier from "eslint-config-prettier";
import globals from "globals";

export default [
{
languageOptions: {
ecmaVersion: 2024,
sourceType: "module",
globals: globals.node,
},
plugins: { n: pluginN },
rules: {
...pluginN.configs["flat/recommended"].rules,

      // Custom rules
      "no-unused-vars": "warn",
      "no-console": "off",
      "prefer-const": "error",

      // ⚠️ Disable if using bundlers / TS
      "n/no-missing-import": "error",
    },

},

// Must be last — disables ESLint formatting conflicts
configPrettier,
];
🎨 3. Prettier Config (.prettierrc)
{
"semi": true,
"singleQuote": true,
"tabWidth": 2,
"trailingComma": "es5",
"printWidth": 100
}
🚫 4. Ignore Files (Important)
.eslintignore
node_modules
dist
build
coverage
.prettierignore
node_modules
dist
build
coverage
package-lock.json
📜 5. Scripts (package.json)
{
"scripts": {
"lint": "eslint .",
"lint:fix": "eslint . --fix && prettier --write .",
"format": "prettier --write ."
}
}
🚀 One Command to Rule Them All
npm run lint:fix
What happens:
Step Tool Action
1 ESLint Fixes best-practice issues automatically
2 Prettier Formats code style & alignment
🔒 6. Pre-commit Hook (Husky + lint-staged)
Install:
npm install -D husky lint-staged
npx husky init
npm install
Add to package.json:
{
"lint-staged": {
"\*.js": ["eslint --fix", "prettier --write"]
}
}
Update .husky/pre-commit:
npx lint-staged
✅ Result
Code is automatically linted & formatted
Bad code cannot be committed
Clean, consistent codebase across your team
⚠️ Notes

Disable this rule if you're using TypeScript, Vite, or Webpack:

"n/no-missing-import": "off"
