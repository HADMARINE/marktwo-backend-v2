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
const User_1 = __importDefault(require("../models/User"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyParamNotNull_1 = __importDefault(require("./verifyParamNotNull"));
const throwError_1 = __importDefault(require("../throwError"));
function verifyUser(headers, id = '') {
    return __awaiter(this, void 0, void 0, function* () {
        const token = headers['x-access-token'];
        verifyParamNotNull_1.default([token]);
        const userValue = yield verifyToken(token, id);
        return userValue;
    });
}
exports.default = verifyUser;
function verifyToken(token, id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let tokenValue = null;
            try {
                tokenValue = jsonwebtoken_1.default.verify(token, process.env.TOKEN_KEY || 'tokenkey');
            }
            catch (error) {
                return throwError_1.default('토큰 검증에 실패했습니다.', 403);
            }
            // tslint:disable-next-line: await-promise
            const user = yield User_1.default.findOne({ id: tokenValue.userId });
            if (!user) {
                return throwError_1.default('로그인에 실패했습니다.', 401);
            }
            if (user.id !== id && id) {
                return throwError_1.default('토큰 검증에 실패했습니다.', 403);
            }
            return user;
        }
        catch (error) {
            return throwError_1.default('토큰 검증에 실패했습니다.', 403);
        }
    });
}
exports.verifyToken = verifyToken;
//# sourceMappingURL=verifyUser.js.map