"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const express_1 = require("express");
function getPathRoutes(routePath = '/') {
    const routesPath = path_1.default.resolve(__dirname, '../routes', `.${routePath}`);
    const dir = fs_1.default.readdirSync(routesPath);
    const datas = [];
    for (const f of dir) {
        const file = path_1.default.join(routesPath, f);
        const stat = fs_1.default.statSync(file);
        if (stat.isDirectory()) {
            datas.push(...getPathRoutes(`${routePath.replace(/\/$/, '')}/${f}`));
            continue;
        }
        if (!file.match(/(.ts|.js)$/)) {
            continue;
        }
        const router = require(file);
        if (Object.getPrototypeOf(router) !== express_1.Router) {
            continue;
        }
        datas.push({
            path: routePath,
            router
        });
    }
    return datas;
}
function getRoutes() {
    return getPathRoutes();
}
exports.default = getRoutes;
//# sourceMappingURL=getRoutes.js.map