import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {upload} from "../middlewares/multer.middleware.js"
import {
    refreshAccessTokenEndPoint,
    registerUser,
    loginUser,
    logoutUser,
    getCurrentUser
} from "../controllers/user.controller.js"

const router=Router()

router.route("/register").post(upload.single("dp"),registerUser)

router.route("/login").post(loginUser)

//secured routes
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/refresh-token").post(refreshAccessTokenEndPoint)
router.route("/current-user").get(verifyJWT,getCurrentUser)

export default router