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
const aws_1 = require("./aws");
const utils_1 = require("./utils");
const updatestatus_1 = require("./updatestatus");
const deleteFolder_1 = require("./deleteFolder");
const path_1 = __importDefault(require("path"));
const ioredis_1 = __importDefault(require("ioredis"));
const publisher = new ioredis_1.default({
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT),
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD
});
const subscriber = new ioredis_1.default({
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT),
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD
});
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        while (1) {
            const res = yield subscriber.brpop('build-queue', 0);
            // @ts-ignore
            const id = res[1];
            yield (0, aws_1.downloadS3Folder)(`output/${id}`);
            console.log("downloded");
            yield (0, updatestatus_1.updatestatus)(id, "building");
            yield publisher.hset("status", id, "building...");
            yield (0, utils_1.buildproject)(id);
            yield (0, updatestatus_1.updatestatus)(id, "build");
            yield publisher.hset("status", id, "build...");
            yield publisher.hset("status", id, "deploying...");
            yield (0, aws_1.copyFinalDist)(id);
            console.log("deleting files");
            yield (0, deleteFolder_1.deleteFolder)(path_1.default.join(__dirname, `output/${id}`));
            console.log("deleted all files");
            yield (0, updatestatus_1.updatestatus)(id, "deployed");
            yield publisher.hset("status", id, "deployed");
        }
    });
}
main();
