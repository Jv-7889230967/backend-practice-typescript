import { Router } from "express";
import { authMiddleware } from "../../middlewares/AuthMiddleware";
import { messageController } from "../../controllers/chat/message.controller";


const router = Router();

router.use(authMiddleware);

router.route("/send_message/:chatId").post(messageController.sendMessage)

export default router;