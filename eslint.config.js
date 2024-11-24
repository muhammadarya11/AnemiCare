import globals from 'globals';


/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    rules: {
      semi: ['error', 'always'],
      'no-var': ['error'],
      quotes: ['error', 'single', { avoidEscape: true }]
    }
  },
  { languageOptions: { globals: globals.node } },
];