import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { uploadImage } from "../controllers/image.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router=Router()
router.use(verifyJWT);

router.route("/upload-image").post(upload.single("image"),uploadImage)

export default router