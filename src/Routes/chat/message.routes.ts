import { Router } from "express";
import { authMiddleware } from "../../middlewares/AuthMiddleware";
import { messageController } from "../../controllers/chat/message.controller";
import { upload } from "../../middlewares/MulterMiddleware";


const router = Router();

router.use(authMiddleware);

router.route("/send_message/:chatId").post(upload.single("chatAttachments"),messageController.sendMessage)

export default router;