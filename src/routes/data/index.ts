import express from 'express';
const router = express.Router();

import User, { UserDocument } from '../../lib/models/User';
import Data, { DataDocument } from '../../lib/models/Data';
import bodyParser from 'body-parser';
import throwError from '../../lib/throwError';

router.use(bodyParser.json());

router.get('/:type', async (req, res, next) => {
  const type = req.params.type;
  let query = { type: type };

  try {
    let data: any;
    console.log('data query')
    try {
      // tslint:disable-next-line: await-promise
      data = await Data.find(query).sort('title');
    } catch (e) {
      return throwError('데이터를 불러오는 데 실패했습니다.', 500);
    }
    res.json({ result: data });
  } catch (e) {
    next(e);
  }
});

router.post('/:type', async (req, res, next) => {});

module.exports = router;
