import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Blog } from "../models/blog.model.js";
import { User } from "../models/user.model.js";

const createBlog = asyncHandler(async (req, res) => {
    const {title,content}=req.body
    
    // Validate the data
    if (!title) {
        throw new ApiError(400, "Title is required");
    }
    if (!content) {
        throw new ApiError(400, "Content is required");
    }

    // Check for featured image
    const featuredImageLocalPath = req.file?.path;
    if (!featuredImageLocalPath) {
        throw new ApiError(400, "Featured image is required");
    }

    // Upload featured image to Cloudinary
    const featuredImage = await uploadOnCloudinary(featuredImageLocalPath);
    if (!featuredImage) {
        throw new ApiError(400, "Error while uploading featured image to Cloudinary");
    }

    // Find the owner (user) based on the refresh token
    const user = await User.findOne({ refreshToken: req.cookies.refreshToken });
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // Create a new blog
    const blog = await Blog.create({
        title: title,
        content: content,
        owner: user._id,
        featuredImage: featuredImage.url
    });

    if (!blog) {
        throw new ApiError(500, "Error while creating the blog");
    }

    // Return success response
    return res.status(201).json(new ApiResponse(201, blog, "Blog created successfully"));
});

const updateBlog = asyncHandler(async (req, res) => {

    //getting blogID
    const { blogId } = req.params
    if(!blogId){
        throw new ApiError(400,"blog Id cant be fetched from params")
    }

    //only the owner can update the blog
    const blog = await Blog.findById(blogId)
    if(!blog){
        throw new ApiError(400,"Cant find Blog")
    }


    const user = await User.findOne({
        refreshToken: req.cookies.refreshToken,
    })
    if (!user) {
        throw new ApiError(404, "User not found")
    }

    if (blog?.owner.equals(user._id.toString())) {

        const {content}=req.body

        if(!content){
            throw new ApiError(400,"Please provide content to update")
        }

        blog.content=blog
        await blog.save({validateBeforeSave:false})

        return(
            res
            .status(200)
            .json(new ApiResponse(200,blog,"Blog updated successfully"))
        )

    }else{
        throw new ApiError(400,"Only the owner can update the blog")
    }
})

const getAllPublishedBlogs = asyncHandler(async (req, res) => {
    const blogs = await Blog.find({ status: true }).populate('owner', '-password')

    if (!blogs) {
        throw new ApiError(404, "No published blogs found")
    }

    return res.status(200).json(new ApiResponse(200, blogs, "Published blogs retrieved successfully"))
});

const deleteBlog = asyncHandler(async (req, res) => {
    const {blogId}=req.params
    if(!blogId){
        throw new ApiError(400,"Blog id cant be fetched for params")
    }
    const blog= await Blog.findById(blogId)
    

    const user = await User.findOne({
        refreshToken: req.cookies.refreshToken,
    })
    if (!user) {
        throw new ApiError(404, "User not found")
    }


    //only the owner can delete the blog
    if (blog?.owner.equals(user._id.toString())) {
        await Blog.findByIdAndDelete(blogId)
        return(
            res
            .status(200)
            .json(new ApiResponse(200,{},"Blog deleted successfully"))
        )
    }else{
        throw new ApiError(401,"Only user can delete the Blog")
    }

})

const getBlogById=asyncHandler(async(req,res)=>{
    try {
        const { blogId } = req.params
        if(!blogId){
            throw new ApiError(400,"blogId cant be fetched from params")
        }
    
        const blog=await Blog.findById(blogId)
        if(!blog){
            throw new ApiError(400,"Cant find blog")
        }

        return(
            res
            .status(200)
            .json(new ApiResponse(200,blog,"blog fetched successfully"))
        )

    } catch (error) {
        throw new ApiError(400,`Internal Error ${error}` )
    }
})

export{
    createBlog,
    updateBlog,
    getAllPublishedBlogs,
    deleteBlog,
    getBlogById
}