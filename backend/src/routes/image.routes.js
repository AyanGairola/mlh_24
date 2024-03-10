import { Router } from "express";
import { uploadImage } from "../controllers/image.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router=Router()

router.route("/upload-image").post(upload.single("image"),uploadImage)

export default router