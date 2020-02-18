"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
require('dotenv').config();
const MONGO_URL = 'mongodb://' + process.env.DB_HOST;
const env = process.env.NODE_ENV || 'development';
const auth = {
    user: process.env.DB_USER,
    pass: process.env.DB_PASS
};
const mongoURL = MONGO_URL;
let dbName = process.env.DB_NAME;
if (env !== 'production')
    dbName += `_${env}`;
if (env === 'development') {
    mongoose_1.default.set('debug', true);
}
module.exports = () => mongoose_1.default.connect(mongoURL, Object.assign(Object.assign({}, auth), { dbName, useNewUrlParser: true, useUnifiedTopology: true }));
//# sourceMappingURL=connectDB.js.map