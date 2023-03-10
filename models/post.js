const mongoose=require('mongoose')
const {ObjectId}=mongoose.Schema.Types
//creating the Post schema model(database)
const postSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    body:{
        type:String,
        required:true
    },
    photo:{
        type:String,
        
    },
    likes:[{
        type:ObjectId,
        ref:"User"
    }],
    tags:[{
        type: String
    }],
    comments:[{
        text:String,
        postedBy:{type:ObjectId,ref:"User"}
        
    }],
    postedBy:{
        type:ObjectId,
        ref:"User"

    },
   
    
},{timestamps:true})

mongoose.model("Post",postSchema)