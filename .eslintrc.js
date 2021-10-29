module.exports = {
  root: true,
  env: {
    es2021: true,
    node: true,
  },
  overrides: [
    {
      files: ['*.js'],
      extends: ['eslint:recommended', 'prettier'],
    },
    {
      files: ['packages/**/*.ts'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        tsconfigRootDir: __dirname,
        project: ['./packages/**/tsconfig.json'],
      },
      settings: {
        'import/resolver': {
          typescript: {
            alwaysTryTypes: true,
            project: ['./packages/**/tsconfig.json'],
          },
        },
      },
      plugins: ['import'],
      extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:import/errors',
        'plugin:import/warnings',
        'plugin:import/typescript',

        // prettier config will turn rules off according to prettier, it should always be at the end
        'prettier',
      ],
      rules: {
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-inferrable-types': 'off',
      },
    },
  ],
}
