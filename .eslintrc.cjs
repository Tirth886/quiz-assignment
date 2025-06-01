module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module'
  },
  env: {
    node: true,
    es2020: true
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  plugins: ['@typescript-eslint', 'jsonc'],
  rules: {
    'indent': ['error', 2],
    'quotes': ['error', 'single'],
    'semi': ['error', 'always'],
    'no-trailing-spaces': 'error',
    'space-before-blocks': ['error', 'always'],
    'keyword-spacing': ['error', { before: true, after: true }],
    'arrow-spacing': ['error', { before: true, after: true }],
    'no-console': 'warn',
    'no-multiple-empty-lines': ['warn', { max: 1 }],
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'object-curly-spacing': ['error', 'always'],
    'comma-spacing': ['error', { before: false, after: true }]
  },
  overrides: [
    {
      files: ['*.json', '*.jsonc'],
      parser: 'jsonc-eslint-parser',
      plugins: ['jsonc'],
      rules: {
        'jsonc/indent': ['error', 2],
        'jsonc/comma-dangle': ['error', 'never'],
        'jsonc/key-spacing': ['error', { beforeColon: true, afterColon: true }],
        'jsonc/object-curly-spacing': ['error', 'always']
      }
    }
  ]
};
