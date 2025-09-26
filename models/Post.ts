import mongoose from "mongoose";
//Schema for Posts
const PostSchema=new mongoose.Schema({
    AuthorName:{type: String},
    email:{type: String},
    Title:{Type: String},
    Category:{Type: String},
    Abstract:{Type: String},
    //Unsure on what format to store the images
    //I will keep it mixed for now
    //Cover_Picture:{Type: mongoose.Schema.Types.Mixed, default: null},
    Body:{Type: String},
    Conclusion:{Type: String},
    Author_Background:{Type: String}
})
//to create a model
const Post=mongoose.models.Post ||mongoose.model("Post",PostSchema);
export default Post