"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const dataSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    img: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    maclink: {
        type: String,
        default: null
    },
    type: {
        type: String,
        required: true
    }
});
const Data = mongoose_1.model('data', dataSchema);
exports.default = Data;
//# sourceMappingURL=Data.js.map