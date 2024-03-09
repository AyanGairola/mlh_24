import mongoose from "mongoose";

const imageSchema=new mongoose.Schema({
    image:{
        type:String,
        required:true
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
},{timestamps:true})

export const Image=mongoose.model("Image",imageSchema)