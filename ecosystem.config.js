module.exports = {
  apps: [
    {
      name: 'marktwo-backend',
      script: './index.ts',
      env: {
        NODE_ENV: 'production'
      },
      watch: 'true'
    }
  ]
};
