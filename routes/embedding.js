const Posts = new Schema ({
    title: {
        type: String,
        required: true,
        max: 30
    },
    content: {
        type: String,
        required: true, 
    },
    comments: [Users]
})

const Users = new Schema ({
    name: {
        type: String,
        required: true
    },
    email: {
        type:String,
        required: true
    },
    posts: [Posts]

})