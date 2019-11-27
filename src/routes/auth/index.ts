import express from 'express';
const router = express.Router();
import bodyParser from 'body-parser';
import crypto from 'crypto';
import util from 'util';
import jwt from 'jsonwebtoken';

// Schema
import User, { UserDocument } from '../../lib/models/User';

import throwError from '../../lib/throwError';

router.use(bodyParser.json());

router.post('/', async (req: any, res: any, next: any) => {
  try {
    const pbkdf2: Function = util.promisify(crypto.pbkdf2);

    const { uid, password, userip } = req.body;
    if (!uid || !password || !userip) {
      throwError('필수 항목이 입력되지 않았습니다.', 400);
    }

    // tslint:disable-next-line: await-promise
    const user: any = await User.findOne({ uid });
    if (!user) throwError('로그인에 실패했습니다.', 403);

    const cryptoPassword: string = (
      await pbkdf2(password, user.enckey, 100000, 64, 'sha512')
    ).toString('base64');

    if (user.password !== cryptoPassword) {
      throwError('로그인에 실패했습니다.', 403);
    }

    const payload: object = {
      userId: user.uid,
      name: user.name,
      _id: user._id,
      userip
    };
    const tokenExpireTime: number = 10800;

    const jwtSettings: object = {
      expiresIn: tokenExpireTime,
      issuer: process.env.NODE_ENV === 'development' ? '*' : 'marktwo.net'
    };

    const result: string = jwt.sign(
      payload,
      process.env.TOKEN_KEY || 'tokenkey',
      jwtSettings
    );
    res.status(200).json({ token: result });
  } catch (e) {
    next(e);
  }
});

router.post('/verify', async (req, res, next) => {
  try {
    const token: any = req.headers['x-access-token'];
    const userPublicIp: any = req.body.publicip;

    if (!token || !userPublicIp) {
      return throwError('필수 항목이 입력되지 않았습니다.', 400);
    }

    let tokenValue: any;
    try {
      tokenValue = jwt.verify(token, process.env.TOKEN_KEY || 'tokenkey');
      if (tokenValue.publicip !== userPublicIp) {
        return throwError('토큰 검증에 실패했습니다.', 403);
      }
    } catch (e) {
      return throwError('토큰 검증에 실패했습니다.', 403);
    }
    res.status(200).json({ userid: tokenValue.userId });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
