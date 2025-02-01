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
exports.CheckUser = void 0;
const UserModels_1 = require("../../models/auth/UserModels");
class CheckUser {
    constructor(userId) {
        this.userId = userId;
    }
    checkUser() {
        return __awaiter(this, void 0, void 0, function* () {
            const userExists = UserModels_1.User.findById(this.userId).select("_id");
            if (!userExists) {
                return false;
            }
            return true;
        });
    }
}
exports.CheckUser = CheckUser;
