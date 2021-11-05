module.exports = {
  apps: [
    {
      name: `packages:build-graphql-codegen-plugin`,
      autorestart: false,
      cwd: 'packages/graphql-codegen-plugin',
      script: 'yarn watch',
      watch: ['tsconfig.json'],
    },

    {
      name: `packages:build-apollo-server-plugin`,
      autorestart: false,
      cwd: 'packages/apollo-server-plugin',
      script: 'yarn watch',
      watch: ['tsconfig.json'],
    },

    {
      name: `packages:build-apollo-client-link`,
      autorestart: false,
      cwd: 'packages/apollo-client-link',
      script: 'yarn watch',
      watch: ['tsconfig.json'],
    },

    {
      name: `example:codegen`,
      autorestart: false,
      script: 'yarn example:codegen --watch',
      watch: ['example/codegen.yml'],
    },

    {
      name: `example:build-api`,
      autorestart: false,
      cwd: 'example/api',
      script: 'yarn watch',
    },

    {
      name: `example:api`,
      autorestart: false,
      cwd: 'example/api',
      script: 'yarn dev',
      watch: ['./dist/src', '../packages/graphql-codegen-plugin/*.js'],
      env: {
        NODE_ENV: 'development',
      },
    },

    {
      name: `example:app`,
      autorestart: false,
      cwd: 'example/app',
      script: 'yarn start',
      watch: ['tsconfig.json', '../packages/apollo-client-link/*.js'],
      env: {
        NODE_ENV: 'development',
        SKIP_PREFLIGHT_CHECK: true,
        BROWSER: 'none',
      },
    },
  ],
}
