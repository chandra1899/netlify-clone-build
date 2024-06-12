"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFolder = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const deleteFolder = (directoryPath) => {
    try {
        if (fs_1.default.existsSync(directoryPath)) {
            fs_1.default.readdirSync(directoryPath).forEach((file) => {
                const currentPath = path_1.default.join(directoryPath, file);
                if (fs_1.default.lstatSync(currentPath).isDirectory()) {
                    (0, exports.deleteFolder)(currentPath);
                }
                else {
                    fs_1.default.unlinkSync(currentPath);
                }
            });
        }
    }
    catch (error) {
        console.log("error in deleting files", error);
    }
};
exports.deleteFolder = deleteFolder;
