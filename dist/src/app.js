"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const bodyParser = require('body-parser');
const app = express_1.default();
const throwError_1 = __importDefault(require("./lib/throwError"));
const getRoutes_1 = __importDefault(require("./lib/getRoutes"));
const routes = getRoutes_1.default();
app.use(cors_1.default({
    origin: process.env.NODE_ENV === 'development' ? '*' : 'https://marktwo.net'
}));
app.use(bodyParser.json({ extended: true }));
routes.forEach((data) => {
    app.use(data.path || '/', data.router);
});
// 404 처리 핸들러
app.use(() => {
    // throwError를 통한 에러 핸들링 권장.
    throwError_1.default('Page Not found.', 404);
});
// Error 처리 핸들러
app.use((error, req, res, next) => {
    const status = error.status || 500;
    const message = error.message && error.expose
        ? error.message
        : 'An error has occurred. Please Try Again.';
    const data = error.data || {};
    if (!error.expose || process.env.NODE_ENV === 'development') {
        console.error(error);
    }
    res.status(status).json(Object.assign({ status,
        message }, data));
});
module.exports = app;
//# sourceMappingURL=app.js.map