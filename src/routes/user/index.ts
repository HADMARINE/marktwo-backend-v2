import express from 'express';
const router = express.Router();

import bodyParser from 'body-parser';
import throwError from '../../lib/throwError';
import util from 'util';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

// const User = require('../../lib/models/User');
import User, { UserDocument } from '../../lib/models/User';

router.use(bodyParser.json());

router.get('/', (req: any, res: any) => {
  const date: Date = new Date();
  res.send(date);
});

router.post('/', async (req, res, next) => {
  try {
    const { uid, password, name, email } = req.body;
    if (!uid || !password || !name || !email) {
      return throwError('필수 항목이 입력되지 않았습니다', 400);
    }
    // tslint:disable-next-line: await-promise
    const duplicateUserVerify: any = await User.findOne().or([
      { uid },
      { name },
      { email }
    ]);
    if (duplicateUserVerify) {
      return throwError('이미 존재하는 유저입니다.', 422);
    }
    const randomBytes: Function = util.promisify(crypto.randomBytes);
    const pbkdf2: Function = util.promisify(crypto.pbkdf2);

    const buf: string = (await randomBytes(64)).toString('base64');
    const key: string = (
      await pbkdf2(password, buf, 100000, 64, 'sha512')
    ).toString('base64');

    if (process.env.EXAMINE_PASSWORD) {
      const testKey: string = (
        await pbkdf2(password, buf, 100000, 64, 'sha512')
      ).toString('base64');
      if (testKey !== key) {
        return throwError('암호화 검증에 실패했습니다.', 500);
      }
    }

    const user = new User({
      uid: uid,
      password: key,
      name: name,
      enckey: buf,
      email: email,
      data: []
    });

    await user.save();

    res.status(201).json({ state: true });
  } catch (e) {
    next(e);
  }
});

router.post('/:id/modify', async (req, res, next) => {
  try {
    res.send('id : ' + req.params.id + ' ||| NOT READY...');
  } catch (e) {
    next(e);
  }
});

router.post('/overlap', async (req, res, next) => {
  try {
    let { type, content } = req.body;

    if (!type || content === undefined) {
      return throwError('필수 항목이 입력되지 않았습니다.', 400);
    }
    const typeArray: Array<String> = ['id', 'email'];

    if (typeArray.indexOf(type) === -1) {
      return throwError('입력 값이 잘못되었습니다', 400);
    }

    if (type === 'id') {
      type = 'uid';
    }

    const query: Object = { [type]: content };
    const user: any = await User.findOne(query);

    let status: number;
    if (user) {
      status = 409;
    } else {
      status = 200;
    }
    res.status(status).json({ overlap: !!user });
  } catch (e) {
    next(e);
  }
});

router.post('/data', async (req, res, next) => {
  const token: any = req.headers['x-access-token'];

  try {
    let tokenValue: any;
    try {
      tokenValue =
        jwt.verify(token, process.env.TOKEN_KEY || 'tokenkey') ||
        JSON.parse('');
    } catch (e) {
      return throwError('토큰 검증에 실패했습니다', 403);
    }

    // tslint:disable-next-line: await-promise
    const user: any = await User.findOne({ uid: tokenValue.userId }).select(
      'uid name email'
    );

    if (!user) {
      return throwError('유저가 존재하지 않습니다.', 404);
    }

    res.status(200).json(user);
  } catch (e) {
    next(e);
  }
});

function getRandomArbitrary(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

router.post('/find/password', async (req, res, next) => {
  try {
    const { uid, publicip, email } = req.body;

    let user: any;
    try {
      user = await User.findOne({ uid });
    } catch (e) {
      return throwError('데이터를 불러오는 데 실패했습니다.', 404);
    }

    const randomNumber: number = getRandomArbitrary(100000, 1000000);

    const sendText =
      '인증번호는 [ ' +
      randomNumber +
      ' ] 입니다. 코드는 5분간 유효합니다. 본인이 요청하지 않았다면 이 요청을 무시해도 됩니다. ';

    const payload: object = {
      userId: uid,
      publicip,
      code: randomNumber
    };

    const tokenExpireTime: number = 300; //5min

    const jwtSettings: object = {
      expiresIn: tokenExpireTime,
      issuer: process.env.NODE_ENV === 'development' ? '*' : 'marktwo.net'
    };

    const verifyToken = jwt.sign(payload, randomNumber.toString(), jwtSettings);

    const mailgun = require('mailgun-js');
    const DOMAIN = process.env.MAILGUN_DOMAIN || 'mail.marktwo.net';
    const mg = mailgun({
      apiKey: process.env.MAILGUN_APIKEY || 'null',
      domain: DOMAIN
    });
    //  현재 미구현
    const data = {
      from: process.env.MAILGUN_EMAIL_ADDRESS,
      to: user.email,
      subject: 'MARKTWO 비밀번호 복구 인증키',
      text: ''
    };
    mg.messages().send(data, function(error: any, body: any) {
      if (error) {
        return throwError(error, 500);
      }
      console.log(body);
    });

    res.json({ token: verifyToken });
  } catch (e) {
    next(e);
  }
});

router.post('/find/password/verify', (req, res, next) => {
  const userPublicIp: any = req.body.publicip;
  const { passcode } = req.body;
  const token: any = req.headers['x-access-token'];
  try {
    if (!userPublicIp || !passcode || !token) {
      return throwError('필수 항목이 입력되지 않았습니다.', 403);
    }

    let tokenValue: any;

    try {
      tokenValue = jwt.verify(token, passcode);
    } catch (e) {
      throwError('토큰 검증에 실패했습니다.', 403);
    }
    if (tokenValue.publicip !== userPublicIp) {
      throwError('토큰 검증에 실패했습니다.', 403);
    }
    res.json({ verified: true });
  } catch (e) {
    next(e);
  }
});

router.post;

module.exports = router;
