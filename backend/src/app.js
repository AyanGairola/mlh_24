import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors"


const app=express()

app.use(cors({
    origin: process.env.CORS_ORIGIN
}))

app.use(express.json({limit:"15kb"}))
app.use(express.urlencoded({extended: true, limit: "15kb"}))
app.use(express.static("public"))
app.use(cookieParser())


//routes import
import userRoutes from "./routes/user.routes.js"
import blogRoutes from "./routes/blog.routes.js"
import imageRoutes from "./routes/image.routes.js"

//routes declare
app.use("/users",userRoutes)
app.use("/blogs",blogRoutes)
app.use("/images",imageRoutes)

export default app;