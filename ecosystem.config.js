module.exports = {
  apps: [
    {
      name: 'marktwo-backend',
      script: './dist/marktwo.js',
      env: {
        NODE_ENV: 'production'
      },
      watch: 'true'
    }
  ]
};
