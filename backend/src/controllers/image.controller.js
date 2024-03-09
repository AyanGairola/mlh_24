import { Image } from "../models/image.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const uploadImage=asyncHandler(async(req,res)=>{
    const imageLocalPath=req.file?.path
    if(!imageLocalPath){
        throw new ApiError(400,"featured image is required")
    }

    // Upload featured image to Cloudinary
    const imageCloudinary = await uploadOnCloudinary(imageLocalPath);
    if (!imageCloudinary) {
        throw new ApiError(400, "Error while uploading image to Cloudinary");
    }

    const user = await User.findOne({ refreshToken: req.cookies.refreshToken });
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const image=await Image.create({
        image:imageCloudinary.url,
        owner: user._id
    })

    if(!image){
        throw new ApiError(500,"Error creating entry in database")
    }

    return(
        res
        .status(200)
        .json(new ApiResponse(200,image,"Image uploaded on database"))
    )
})

export{
    uploadImage
}