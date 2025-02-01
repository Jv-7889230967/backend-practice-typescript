import { Router } from "express";
import { chatController } from "../../controllers/chat/chat.controller.js";
import { authMiddleware } from "../../middlewares/AuthMiddleware.js";


const router = Router();

router.use(authMiddleware);

router.route("/chats/:receiverId").get(chatController.CreateorGetChat)

export default router;