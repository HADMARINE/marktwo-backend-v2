module.exports = {
  apps: [
    {
      name: 'marktwo-backend',
      script: './dist/index.js',
      env: {
        NODE_ENV: 'production'
      },
      watch: 'true'
    }
  ]
};
