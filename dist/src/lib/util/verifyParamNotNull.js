"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const throwError_1 = __importDefault(require("../throwError"));
function verifyParamNotNull(param) {
    param.map(data => {
        if (!data) {
            return throwError_1.default('필수 항목이 입력되지 않았습니다.', 400);
        }
    });
}
exports.default = verifyParamNotNull;
//# sourceMappingURL=verifyParamNotNull.js.map