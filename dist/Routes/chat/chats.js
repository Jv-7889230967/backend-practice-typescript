"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const chat_controller_1 = require("../../controllers/chat/chat.controller");
const AuthMiddleware_1 = require("../../middlewares/AuthMiddleware");
const router = (0, express_1.Router)();
router.use(AuthMiddleware_1.authMiddleware);
router.route("/chats/:receiverId").get(chat_controller_1.chatController.CreateorGetChat);
exports.default = router;
