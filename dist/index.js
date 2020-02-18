"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const http = require('http');
const app = require('./src/app');
const connectDB = require('./src/lib/connectDB');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = __importStar(require("express"));
const router = express.Router();
const server = http.createServer(app);
const PORT = process.env.PORT || 4000;
connectDB()
    .then(() => {
    server.listen(PORT, () => {
        console.log(`App started on port ${PORT}`);
    });
})
    .catch((e) => console.error(e));
module.exports = router;
//# sourceMappingURL=index.js.map