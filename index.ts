const http = require('http');
const app = require('./src/app');
const connectDB = require('./src/lib/connectDB');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

import * as express from 'express';
const router = express.Router();

const server = http.createServer(app);

const PORT = process.env.PORT || 4000;

connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`App started on port ${PORT}`);
    });
  })
  .catch((e: any) => console.error(e));

module.exports = router;
