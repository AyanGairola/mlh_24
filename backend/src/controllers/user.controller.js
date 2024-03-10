import { User } from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import jwt from 'jsonwebtoken'


const registerUser=asyncHandler(async (req,res)=>{
    //taking user details
    const {username,email,password}=req.body
    console.log("user:",username);



    //validating the data
    const requiredFields = ["username", "email", "password"];
    requiredFields.forEach(field => {
        if (req.body[field]==="") {
            throw new ApiError(400, `${field} is required`);
        }
    });
    console.log("Validation complete");


    //checking for dp
    const dpLocalPath=req.file?.path

    console.log("Local file saved");

    //uploading on cloudinary
    const dp= await uploadOnCloudinary(dpLocalPath)
    console.log("Uploaded on cloudinary");

    if(!dp){
        throw new ApiError(400,"Error while uploading on cloudinary")
    }


    //checking if user exists or not
    console.log("Finding if user exists or not");
    const existedUser=await User.findOne({
        $or:[{username},{email}]
    })
    if(existedUser){
        console.log(existedUser)
        console.log("hhhhh")
        throw new ApiError(409,"User already exists")
        throw new ApiError(400,"User already exists")
    }
    
    console.log("User does not exists so creating one");

    //storing data in database
    const user= await User.create({
        username: username.toLowerCase(),
        email,
        password,
        dp: dp.url || "cld-sample-"
    })

    //removing password and refresh tokens from response
    const createdUser= await User.findById(user._id).select(
        "-password -refreshToken"
    )
    
    //final check- if user has been registered or not
    if(!createdUser){
        throw new ApiError(500,"Something went wrong while registering the user")
    }
    console.log(createdUser)

    //return response
    return(
        res
        .status(200)
        .json(new ApiResponse(200,createdUser,"User created successfully"))
    )


})


const generateAccessAndRefreshTokens= async(userId)=>{
    try {
        const user=await User.findById(userId)
        const refreshToken=user.generateRefreshToken()
        const accessToken=user.generateAccessToken()

        user.refreshToken=refreshToken

        await user.save({validateBeforeSave:false}) 

        return {accessToken,refreshToken} 

    } catch (error) {
        throw new ApiError(500,"Something went wrong while generating access and refresh tokens")
    }
}


const refreshAccessTokenEndPoint=asyncHandler(async(req,res)=>{
    const incomingRefreshToken=req.cookies.refreshToken || req.body.refreshToken
    if (!incomingRefreshToken) {
        throw new ApiError(401,"Unauthorized Request")

    }

    //verifying incoming access token
    const decodedToken=jwt.verify(token,process.env.REFRESH_TOKEN_SECRET)

    const user=await User.findById(decodedToken._id)
    if (!user) {
        throw new ApiError(401,"Invalid refresh token")
    }

    if (incomingRefreshToken != user?.refreshToken) {
        throw new ApiError(401,"Expired or used refresh token")
    }

    // generating new refresh token
    
    const {accessToken,newRefreshToken}= await generateAccessAndRefreshTokens(user._id)

    //returning response
    const options={
        httpOnly:true,
        secure:true
    }

    return(
        res
        .status(200)
        .cookie("accessToken",accessToken,options)
        .cookie("refreshToken",newRefreshToken,options)
        .json(
            new ApiResponse(
                200,
                {
                    accessToken,newRefreshToken
                },
                "Token refreshed successfully"
            )
        )
    )

})

const loginUser=asyncHandler(async(req,res)=>{
   
    // Taking data from req.body
    
    const {username,email,password}=req.body
    if (!(username || email)) {
        throw new ApiError(400,"Username or email is required")
    }

    // checking if user is registered or not
    
    const user=await User.findOne({
        $or:[{username},{email}]
    })

    if (!user) {
        throw new ApiError(404,"User is not registered")
    }


    // checking the password
    const isPasswordValid=await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new ApiError(401,"Incorrect Password")
    }


    //refresh and access tokens and sending them to cookies

    const {accessToken,refreshToken}=await generateAccessAndRefreshTokens(user._id) // interacting with the database "can" take time

    const loggedInUser=await User.findById(user._id).select("-password -refreshToken")


    //returning the response
    return (
        res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {
                    user:loggedInUser,refreshToken,accessToken
                },
                "User logged in successfully"
            )
        )
        )


})



const logoutUser=asyncHandler(async(req,res)=>{
    const {refreshToken}=req.body
    const user = await User.findOne({
        refreshToken: refreshToken,
    })

    //removing refresh token from database
    await User.findByIdAndUpdate(
        user._id,
        {
            $unset:{
                refreshToken:1 
            }
        },{
            new:true
        }
    )

    return (
        res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {},
                "User logged out successfully"
            )
        )
        )

})


const getCurrentUser=asyncHandler(async(req,res)=>{
    console.log(req)
    const user = await User.findOne({
        refreshToken: req.cookies.refreshToken,
    }).select("-password -refreshToken")

    if (!user) {
        throw new ApiError(404, "User not found")
    }

    return(
        res
        .status(200)
        .json(new ApiResponse(200,user,"current user retrieved successfully "))
    )
})


export{
    generateAccessAndRefreshTokens,
    refreshAccessTokenEndPoint,
    registerUser,
    loginUser,
    logoutUser,
    getCurrentUser
}