import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import{
    createBlog,
    updateBlog,
    getAllPublishedBlogs,
    deleteBlog,
    getBlogById
} from "../controllers/blog.controller.js"
import { upload } from "../middlewares/multer.middleware.js";

const router=Router()
router.route("/get-all-blogs").get(getAllPublishedBlogs)

//secured routes
router.route("/").post(upload.single("img"),verifyJWT,createBlog)
router.route("/:blogId").patch(verifyJWT,updateBlog).delete(verifyJWT,deleteBlog).get(verifyJWT,getBlogById)


export default router