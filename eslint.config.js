import globals from 'globals';


/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    rules: {
      semi: ['error', 'always'],
      quotes: ['error', 'single', { avoidEscape: true }]
    },
    ignores: ['.predict_service/', '.node_modules/']
  },
  { languageOptions: { globals: globals.node } },
];