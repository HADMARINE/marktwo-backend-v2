"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const body_parser_1 = __importDefault(require("body-parser"));
const throwError_1 = __importDefault(require("../../lib/throwError"));
const util_1 = __importDefault(require("util"));
const crypto_1 = __importDefault(require("crypto"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// const User = require('../../lib/models/User');
const User_1 = __importDefault(require("../../lib/models/User"));
router.use(body_parser_1.default.json());
router.post('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { uid, password, name, email } = req.body;
        if (!uid || !password || !name || !email) {
            return throwError_1.default('필수 항목이 입력되지 않았습니다', 400);
        }
        // tslint:disable-next-line: await-promise
        const duplicateUserVerify = yield User_1.default.findOne().or([
            { uid },
            { name },
            { email }
        ]);
        if (duplicateUserVerify) {
            return throwError_1.default('이미 존재하는 유저입니다.', 422);
        }
        const randomBytes = util_1.default.promisify(crypto_1.default.randomBytes);
        const pbkdf2 = util_1.default.promisify(crypto_1.default.pbkdf2);
        const buf = (yield randomBytes(64)).toString('base64');
        const key = (yield pbkdf2(password, buf, 100000, 64, 'sha512')).toString('base64');
        if (process.env.EXAMINE_PASSWORD) {
            const testKey = (yield pbkdf2(password, buf, 100000, 64, 'sha512')).toString('base64');
            if (testKey !== key) {
                return throwError_1.default('암호화 검증에 실패했습니다.', 500);
            }
        }
        const user = new User_1.default({
            uid: uid,
            password: key,
            name: name,
            enckey: buf,
            email: email,
            data: []
        });
        yield user.save();
        res.status(201).json({ state: true });
    }
    catch (e) {
        next(e);
    }
}));
// router.get('/', async (req, res, next) => {
//   try {
//     const userData = await verifyUser(req.headers);
//     return userData;
//   } catch (error) {
//     next(error);
//   }
// });
router.post('/:id/modify', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.send('id : ' + req.params.id + ' ||| NOT READY...');
    }
    catch (e) {
        next(e);
    }
}));
router.post('/overlap', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { type, content } = req.body;
        if (!type || content === undefined) {
            return throwError_1.default('필수 항목이 입력되지 않았습니다.', 400);
        }
        const typeArray = ['id', 'email'];
        if (typeArray.indexOf(type) === -1) {
            return throwError_1.default('입력 값이 잘못되었습니다', 400);
        }
        if (type === 'id') {
            type = 'uid';
        }
        const query = { [type]: content };
        const user = yield User_1.default.findOne(query);
        let status;
        if (user) {
            status = 409;
        }
        else {
            status = 200;
        }
        res.status(status).json({ overlap: !!user });
    }
    catch (e) {
        next(e);
    }
}));
router.post('/data', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.headers['x-access-token'];
    try {
        let tokenValue;
        try {
            tokenValue =
                jsonwebtoken_1.default.verify(token, process.env.TOKEN_KEY || 'tokenkey') ||
                    JSON.parse('');
        }
        catch (e) {
            return throwError_1.default('토큰 검증에 실패했습니다', 403);
        }
        const user = yield User_1.default.findOne({ uid: tokenValue.userId })
            .select('uid name email')
            .exec();
        if (!user) {
            return throwError_1.default('유저가 존재하지 않습니다.', 404);
        }
        res.status(200).json(user);
    }
    catch (e) {
        next(e);
    }
}));
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}
router.post('/find/password', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { uid, publicip, email } = req.body;
        let user;
        try {
            user = yield User_1.default.findOne({ uid });
        }
        catch (e) {
            return throwError_1.default('데이터를 불러오는 데 실패했습니다.', 404);
        }
        const randomNumber = getRandomArbitrary(100000, 1000000);
        const sendText = '인증번호는 [ ' +
            randomNumber +
            ' ] 입니다. 코드는 5분간 유효합니다. 본인이 요청하지 않았다면 이 요청을 무시해도 됩니다. ';
        const payload = {
            userId: uid,
            publicip,
            code: randomNumber
        };
        const tokenExpireTime = 300; //5min
        const jwtSettings = {
            expiresIn: tokenExpireTime,
            issuer: process.env.NODE_ENV === 'development' ? '*' : 'marktwo.net'
        };
        const verifyToken = jsonwebtoken_1.default.sign(payload, randomNumber.toString(), jwtSettings);
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
        mg.messages().send(data, function (error, body) {
            if (error) {
                return throwError_1.default(error, 500);
            }
            console.log(body);
        });
        res.json({ token: verifyToken });
    }
    catch (e) {
        next(e);
    }
}));
router.post('/find/password/verify', (req, res, next) => {
    const userPublicIp = req.body.publicip;
    const { passcode } = req.body;
    const token = req.headers['x-access-token'];
    try {
        if (!userPublicIp || !passcode || !token) {
            return throwError_1.default('필수 항목이 입력되지 않았습니다.', 403);
        }
        let tokenValue;
        try {
            tokenValue = jsonwebtoken_1.default.verify(token, passcode);
        }
        catch (e) {
            throwError_1.default('토큰 검증에 실패했습니다.', 403);
        }
        if (tokenValue.publicip !== userPublicIp) {
            throwError_1.default('토큰 검증에 실패했습니다.', 403);
        }
        res.json({ verified: true });
    }
    catch (e) {
        next(e);
    }
});
router.post('/verify', (req, res, next) => {
    try {
        const token = req.headers['x-access-token'];
        const { userip } = req.body;
        if (!token || !userip) {
            return throwError_1.default('필수 정보가 입력되지 않았습니다.', 400);
        }
        let tokenValue;
        try {
            tokenValue = jsonwebtoken_1.default.verify(token, process.env.TOKEN_KEY || 'tokenkey');
        }
        catch (error) {
            return throwError_1.default('토큰 검증에 실패했습니다.', 403);
        }
        if (tokenValue.userip !== userip) {
            return throwError_1.default('아이피가 변경되어 로그아웃 합니다.', 403);
        }
        res.status(200).json({ state: 'OK' });
    }
    catch (error) {
        next(error);
    }
});
module.exports = router;
//# sourceMappingURL=index.js.map