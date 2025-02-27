"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AuthMiddleware_1 = require("../../middlewares/AuthMiddleware");
const message_controller_1 = require("../../controllers/chat/message.controller");
const MulterMiddleware_1 = require("../../middlewares/MulterMiddleware");
const router = (0, express_1.Router)();
router.use(AuthMiddleware_1.authMiddleware);
router.route("/send_message/:chatId").post(MulterMiddleware_1.upload.single("chatAttachments"), message_controller_1.messageController.sendMessage);
exports.default = router;
