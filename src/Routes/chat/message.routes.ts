import { Router } from "express";
import { authMiddleware } from "../../middlewares/AuthMiddleware.js";
import { messageController } from "../../controllers/chat/message.controller.js";
import { upload } from "../../middlewares/MulterMiddleware.js";


const router = Router();

router.use(authMiddleware);

router.route("/send_message/:chatId").post(upload.single("chatAttachments"),messageController.sendMessage)

export default router;