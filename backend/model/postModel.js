import mongoose, { Mongoose } from "mongoose";

const postSchema = mongoose.Schema({
    postedBy:{
        type:Mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
    },
    text:{
        type:String,
        maxLength:500,
    },
    img:{
        type:String,
    },
    likes:{
        type: Number,
        default:0,
    },
    replies:[
        {
            userId:{
                type: Mongoose.Schema.Types.ObjectId,
                ref:'User',
                required: true,
            },
            text:{
                type:String,
                required:true,
            },
            userProfilePic:{
                type:String,
            },
            username:{
                type:String,
            }
        }
    ]
},{
    timestamps:true
}); 

const Post = mongoose.model('Post',postSchema);

export default Post;