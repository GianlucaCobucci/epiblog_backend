import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
    img : {
        type: String,
        required: false,
        default: "https://picsum.photos/1920/1080"
    },
    title: {
        type: String,
        required: true,
        max: 30
    },
    content: {
        type: String,
        required: true, 
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userModel'
    },
    /* author:{
        type: String,
        required: true,
    }, */
    rate: {
        type: Number,
        max: 5,
        min: 0,
        default: 0
    },
}, {timestamps: true, strict: true})

const postModel = mongoose.model("postModel", PostSchema, "posts");

export default postModel