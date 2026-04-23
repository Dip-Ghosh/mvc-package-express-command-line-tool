const pluginN = require('eslint-plugin-n');
const prettier = require('eslint-config-prettier');
const globals = require('globals');

module.exports = [
  { ignores: ['eslint.config.cjs'] }, // ← separate block, first

  {
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'commonjs',
      globals: globals.node,
    },
    plugins: { n: pluginN },
    rules: {
      ...pluginN.configs['flat/recommended'].rules,
      'no-unused-vars': 'warn',
      'no-console': 'off',
      'prefer-const': 'error',
      'n/no-missing-import': 'error',
    },
  },
  prettier,
];
