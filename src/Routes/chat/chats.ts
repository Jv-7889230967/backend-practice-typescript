import { Router } from "express";
import { chatController } from "../../controllers/chat/chat.controller";
import { authMiddleware } from "../../middlewares/AuthMiddleware";


const router = Router();

router.use(authMiddleware);

router.route("/chats/:receiverId").get(chatController.CreateorGetChat)

export default router;