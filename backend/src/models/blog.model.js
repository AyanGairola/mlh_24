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
    status:{
        type:Boolean,
        default: true
    },
    image:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Image"
    },
    imageURL: {
        type: String,
        required: true
    }
})

export const Blog=mongoose.model("Blog",blogSchema)