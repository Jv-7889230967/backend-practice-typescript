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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloudUpload = void 0;
const cloudinary_1 = require("cloudinary");
const CloudUpload = (fileUrl) => __awaiter(void 0, void 0, void 0, function* () {
    cloudinary_1.v2.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_URL,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    if (!fileUrl) {
        throw new Error("File URL is undefined or empty.");
    }
    const uploadResult = yield cloudinary_1.v2.uploader.upload(fileUrl);
    const generatedUrl = yield cloudinary_1.v2.url(uploadResult === null || uploadResult === void 0 ? void 0 : uploadResult.public_id, {
        transformation: [
            {
                quality: "auto",
                fetch_format: "auto",
            },
            {
                width: 1200,
                height: 1200,
            }
        ]
    });
    return generatedUrl;
});
exports.CloudUpload = CloudUpload;
