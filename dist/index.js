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
const redis_1 = require("redis");
const aws_1 = require("./aws");
const utils_1 = require("./utils");
const updatestatus_1 = require("./updatestatus");
const deleteFolder_1 = require("./deleteFolder");
const path_1 = __importDefault(require("path"));
const subscriber = (0, redis_1.createClient)();
subscriber.connect();
const publisher = (0, redis_1.createClient)();
publisher.connect();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        while (1) {
            const res = yield subscriber.brPop((0, redis_1.commandOptions)({ isolated: true }), "build-queue", 0);
            // @ts-ignore
            const id = res.element;
            yield (0, aws_1.downloadS3Folder)(`output/${id}`);
            console.log("downloded");
            yield (0, updatestatus_1.updatestatus)(id, "building");
            publisher.hSet("status", id, "building...");
            yield (0, utils_1.buildproject)(id);
            yield (0, updatestatus_1.updatestatus)(id, "build");
            publisher.hSet("status", id, "deploying...");
            yield (0, aws_1.copyFinalDist)(id);
            console.log("deleting files");
            yield (0, deleteFolder_1.deleteFolder)(path_1.default.join(__dirname, `output/${id}`));
            yield (0, updatestatus_1.updatestatus)(id, "deployed");
            publisher.hSet("status", id, "deployed");
        }
    });
}
main();
