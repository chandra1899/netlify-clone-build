"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFolder = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// export const deleteFolder = (folderPath : string) => {
//     return new Promise(async (resolve) => {
//         fs.rm(folderPath, { recursive: true, force: true }, (err) => {
//             if (err) {
//                 console.error(`Error deleting folder: ${err.message}`);
//             } else {
//                 console.log(`Folder deleted successfully`);
//                 resolve("")
//             }
//         });
//     })
// }
// export const deleteFolder = (directoryPath : string) => {
//     if (fs.existsSync(directoryPath)) {
//         fs.readdirSync(directoryPath).forEach((file) => {
//             const currentPath = path.join(directoryPath, file);
//             if (fs.lstatSync(currentPath).isDirectory()) {
//                 deleteFolder(currentPath);
//             } else {
//                 fs.unlinkSync(currentPath);
//             }
//         })
//     }
// }
const deleteFolder = (directoryPath) => {
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
        fs_1.default.rmdirSync(directoryPath);
    }
};
exports.deleteFolder = deleteFolder;
