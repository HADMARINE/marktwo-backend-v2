import express from 'express';
const router = express.Router();

import bodyParser from 'body-parser';
import throwError from '../../lib/throwError';

router.use(bodyParser.json());

router.get('/comsil', (req, res, next) => {
  const date: Date = new Date();
  res.send(date);
});

router.get('/utility', (req, res, next) => {});

module.exports = router;
