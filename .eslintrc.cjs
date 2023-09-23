/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  extends: ['@antfu', '@nuxtjs/eslint-config-typescript', 'prettier'],
  overrides: [
    {
      files: ['./server/**/*.ts'],
      rules: {
        'no-console': [
          'error',
          {
            allow: ['info', 'warn', 'trace', 'error'],
          },
        ],
      },
    },
    {
      files: ['./**/*.{vue,js,ts}'],
      rules: {
        'vue/no-setup-props-destructure': 'off',
        '@stylistic/ts/brace-style': 'off',
        '@stylistic/ts/member-delimiter-style': 'off',
        '@stylistic/js/operator-linebreak': 'off',
      },
    },
  ],
};
