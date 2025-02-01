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
exports.SendMessage = void 0;
const twilio_1 = __importDefault(require("twilio"));
const ApiError_1 = require("../../utils/ApiError");
class SendMessage {
    constructor(phonenumber, payload) {
        this.sendMessage = () => __awaiter(this, void 0, void 0, function* () {
            const twillio_SID = process.env.TWILLIO_ACCOUNT_SID;
            const twillio_Auth_TOKEN = process.env.TWILLIO_ACCOUNT_AUTH_TOKEN;
            if (!twillio_SID || !twillio_Auth_TOKEN) {
                throw new ApiError_1.ApiError("Twilio credentials are missing", 500);
            }
            const client = (0, twilio_1.default)(twillio_SID, twillio_Auth_TOKEN);
            try {
                yield client.messages.create({
                    body: this.payload,
                    from: process.env.TWILLIO_PHONE_NUMBER,
                    to: `+91${this.phonenumber}`
                });
            }
            catch (error) {
                throw new ApiError_1.ApiError(error !== null && error !== void 0 ? error : "Failed to send OTP", 500);
            }
        });
        this.phonenumber = phonenumber;
        this.payload = payload;
    }
}
exports.SendMessage = SendMessage;
