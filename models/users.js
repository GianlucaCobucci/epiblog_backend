import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        max: 255
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type:String,
        required: true
    },
    password: {
        type:String,
        required: true
    },
    role: {
        type:String,
        required: false,
        default: "user"
    },
    age : {
        type: Number,
        required: false,
        default: 0
    }, 
    imageUrl: {
        type: String,
        required: false,
        default: "https://thispersondoesnotexist.com"
    }, 
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "postModel",
        default: []
    }]
}, {timestamps: true, strict: true})
                                //stringa     variabile    stringa
const userModel = mongoose.model('userModel', UserSchema, 'users')

export default userModel