"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const body_parser_1 = __importDefault(require("body-parser"));
router.use(body_parser_1.default.json());
router.get('/', (req, res) => {
    const date = new Date();
    res.send(date + ' - MARKTWO-BACKEND-V2');
});
module.exports = router;
//# sourceMappingURL=index.js.map