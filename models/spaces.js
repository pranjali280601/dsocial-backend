const mongoose=require('mongoose')
const {ObjectId}=mongoose.Schema.Types
//creating the Post schema model(database)
const spacesSchema=new mongoose.Schema({
    
    ComputerScience :[{
        type:ObjectId,
        ref: Post
     }],
    Electronics :[{
        type:ObjectId,
        ref: Post
    }],
    Electrical :[{
        type:ObjectId,
        ref: Post
    }],
    Biotechnology :[{
        type:ObjectId,
        ref: Post
    }],
    Mechanical :[{
        type:ObjectId,
        ref: Post
    }],
    Music :[{
        type:ObjectId,
        ref: Post
    }],
    Dance :[{
        type:ObjectId,
        ref: Post
    }],
    Literature :[{
        type:ObjectId,
        ref: Post
    }],
    Miscellaneous :[{
        type:ObjectId,
        ref: Post
    }],
},
{timestamps:true})

mongoose.model("Spaces",spacesSchema)