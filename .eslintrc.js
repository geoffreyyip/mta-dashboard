module.exports = {
  env: { node: true },
  extends: ['airbnb-base', 'prettier'],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': [
      'error',
      {
        trailingComma: 'es5',
        semi: false,
        singleQuote: true,
      },
    ],
    'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
    'no-console': ['off'],  // node envs want console.log
  },
  overrides: [
    {
      files: ['**/*.test.js'],
      env: { mocha: true },
      rules: {
        'prefer-arrow-callback': {
          error: { allowNamedFunctions: true },
        },
        'func-names': ['off'],
      },
    },
  ],
}
