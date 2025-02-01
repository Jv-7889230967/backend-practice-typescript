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
exports.emitSocketEvent = exports.joinChat = exports.initializeSocket = void 0;
const TemporaryStorage_js_1 = require("./utils/TemporaryStorage.js");
const getCurrentUser_js_1 = require("./services/shared/getCurrentUser.js");
const UserModels_js_1 = require("./models/auth/UserModels.js");
const initializeSocket = (io) => {
    io.on("connection", (socket) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        const auth_token = (_b = (_a = socket === null || socket === void 0 ? void 0 : socket.handshake) === null || _a === void 0 ? void 0 : _a.headers) === null || _b === void 0 ? void 0 : _b.authentication;
        const currentUser = (0, getCurrentUser_js_1.getCurrentUser)(auth_token);
        if (currentUser === null || currentUser === void 0 ? void 0 : currentUser.username) {
            const user = yield UserModels_js_1.User.findById(currentUser === null || currentUser === void 0 ? void 0 : currentUser._id).select("-passsword -refreshtoken -createdAt -updatedAt");
            const userId = (user === null || user === void 0 ? void 0 : user._id) ? user._id.toString() : undefined;
            TemporaryStorage_js_1.activeUsers.set(currentUser.username, userId);
            if (userId) {
                socket.join(userId);
            }
            socket.user = user;
            (0, exports.joinChat)(socket); //mounting the join chat event when a user connects to the socket
        }
        else {
            console.log("Failed to get current user");
        }
        socket.on("disconnect", () => {
            var _a;
            console.log("User disconnected", socket.id);
            if (currentUser === null || currentUser === void 0 ? void 0 : currentUser.username) {
                TemporaryStorage_js_1.activeUsers.delete(currentUser.username);
                if ((_a = socket === null || socket === void 0 ? void 0 : socket.user) === null || _a === void 0 ? void 0 : _a._id) {
                    socket.leave(socket.user._id.toString()); //leaving teh socket room when user disconnected
                }
            }
        });
    }));
};
exports.initializeSocket = initializeSocket;
const joinChat = (socket) => {
    socket.on("joinchat", ({ chatId }) => {
        socket.join(chatId);
    });
};
exports.joinChat = joinChat;
const emitSocketEvent = (req, roomId, event, payload) => {
    const io = req.app.get("io"); // Ensure io is recognized
    if (!io) {
        console.error("Socket.io instance is not available on req.app");
        return;
    }
    io.in(roomId).emit(event, payload);
};
exports.emitSocketEvent = emitSocketEvent;
