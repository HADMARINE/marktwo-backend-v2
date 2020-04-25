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
const crypto_1 = __importDefault(require("crypto"));
const util_1 = __importDefault(require("util"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Schema
const User_1 = __importDefault(require("../../lib/models/User"));
const throwError_1 = __importDefault(require("../../lib/throwError"));
router.use(body_parser_1.default.json());
router.post('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pbkdf2 = util_1.default.promisify(crypto_1.default.pbkdf2);
        const { uid, password, userip } = req.body;
        if (!uid || !password || !userip) {
            console.log(uid, password, userip);
            throwError_1.default('필수 항목이 입력되지 않았습니다.', 400);
        }
        // tslint:disable-next-line: await-promise
        const user = yield User_1.default.findOne({ uid });
        if (!user)
            throwError_1.default('로그인에 실패했습니다.', 403);
        const cryptoPassword = (yield pbkdf2(password, user.enckey, 100000, 64, 'sha512')).toString('base64');
        if (user.password !== cryptoPassword) {
            throwError_1.default('로그인에 실패했습니다.', 403);
        }
        const payload = {
            userId: user.uid,
            name: user.name,
            _id: user._id,
            userip
        };
        const tokenExpireTime = 10800;
        const jwtSettings = {
            expiresIn: tokenExpireTime,
            issuer: process.env.NODE_ENV === 'development' ? '*' : 'marktwo.net'
        };
        const result = jsonwebtoken_1.default.sign(payload, process.env.TOKEN_KEY || 'tokenkey', jwtSettings);
        res.status(200).json({ token: result });
    }
    catch (e) {
        next(e);
    }
}));
router.post('/verify', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.headers['x-access-token'];
        const userPublicIp = req.body.userip;
        if (!token || !userPublicIp) {
            return throwError_1.default('필수 항목이 입력되지 않았습니다.', 400);
        }
        let tokenValue;
        try {
            tokenValue = jsonwebtoken_1.default.verify(token, process.env.TOKEN_KEY || 'tokenkey');
            if (tokenValue.userip !== userPublicIp) {
                return throwError_1.default('토큰 검증에 실패했습니다.', 403);
            }
        }
        catch (e) {
            return throwError_1.default('토큰 검증에 실패했습니다.', 403);
        }
        const user = yield User_1.default.findOne({ uid: tokenValue.userId }).exec();
        if (!user) {
            return throwError_1.default('유저가 존재하지 않습니다.', 404);
        }
        res.status(200).json(Object.assign({}, user._doc));
    }
    catch (e) {
        next(e);
    }
}));
module.exports = router;
//# sourceMappingURL=index.js.map