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
const Data_1 = __importDefault(require("../../lib/models/Data"));
const body_parser_1 = __importDefault(require("body-parser"));
const throwError_1 = __importDefault(require("../../lib/throwError"));
router.use(body_parser_1.default.json());
router.get('/:type', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const type = req.params.type;
    let query = { type: type };
    try {
        let data;
        try {
            // tslint:disable-next-line: await-promise
            data = yield Data_1.default.find(query).sort('title');
        }
        catch (e) {
            return throwError_1.default('데이터를 불러오는 데 실패했습니다.', 500);
        }
        res.json({ result: data });
    }
    catch (e) {
        next(e);
    }
}));
router.post('/:type', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () { }));
module.exports = router;
//# sourceMappingURL=index.js.map