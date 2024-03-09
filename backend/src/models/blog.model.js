import mongoose from "mongoose";

const blogSchema= new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    content:{
        type:String,
        required:true
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    featuredImage:{
        type:String,
        required:true
    },
    status:{
        type:Boolean,
        default: true
    }
})

export const Blog=mongoose.model("Blog",blogSchema)