const express = require("express")
const router = express.Router()
const mongoose = require('mongoose')
const requireLogin = require('../middlewares/requireLogin')
const Post = mongoose.model('Post') 
mongoose.set('useFindAndModify', false);




var ComputerScience = ['63adaf3afd30163874d07f4c', '63adaadcfd30163874d07f4b']
var Electronics = ['63ad942b45d00749648a1dd7']
var Electrical = []
var Biotechnology = []
var Mechanical = []
var Music = []
var Dance = []
var Literature = []
var Miscellaneous = ['63ad942b45d00749648a1dd7']
 

router.get('/allposts',requireLogin,(req,res)=>{
    Post.find() // displays all the posts in the table but doesn't display that who posted it
    .populate("postedBy","_id name pic") //therefore we mention it explicitly using the populate function
    .populate("comments.postedBy","_id name")
    .sort("-createdAt")
    .then(posts=>{
        res.json({posts})//show all the posts
    })
    .catch(err=>{
        console.log(err)
    })
})

router.get('/getspaces',requireLogin,(req,res)=>{
    try{
        res.json({ComputerScience, Electrical, Electronics, Dance, Music, Literature, Miscellaneous, Mechanical, Biotechnology});
    }
    catch(err){
        console.log(err);
    }
})
router.post('/createpost',requireLogin,(req,res)=>{ // passing middleware to makesure the user is logged in
    const{title,body,pic, tags}=req.body // getting the title and body from the user
    if(!title || !body || !tags ){
        return res.status(422).json({error:"Please add all fields"})
    }
    console.log(tags)
    req.user.password=undefined // *hence we set the password undefined so it doesn't gets displayed
     const post=new Post({  //creating a new post in the Post schema
        title,
        body,
        photo:pic,
        tags,
        postedBy:req.user //gives even the pswd of the user therefore go to *
     })
     post.save().then(result=>{
         res.json({post:result})
         
         for (let i = 0; i < tags.length; i++) {
            if(tags[i]=='Computer Science')
            ComputerScience.push(result._id);
            else if (tags[i]=='Electronics & Communication')
            Electronics.push(result._id)
            else if (tags[i]=='Electrical')
            Electrical.push(result._id)
            else if (tags[i]=='Biotechnology')
            Biotechnology.push(result._id)
            else if (tags[i]=='Mechanical')
            Mechanical.push(result._id)
            else if (tags[i]=='Music')
            Music.push(result._id)
            else if (tags[i]=='Dance')
            Dance.push(result._id)
            else if (tags[i]=='Literature')
            Literature.push(result._id)
            else
            Miscellaneous.push(result._id)
          }

     })
     .catch(err=>{
         console.log(err)
     })
})

router.get('/mypost',requireLogin,(req,res)=>{
    Post.find({postedBy:req.user._id})
    .populate("postedBy","_id name")
    .populate("comments.postedBy","_id name")
    .then(mypost=>{
        res.json({mypost})
    })
    .catch(err=>{
        console.log(err)
    })
})

router.put('/like',requireLogin,(req,res)=>{
    
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{likes:req.user._id}
    },{
        new:true
    }).exec((err,result)=>{
        if(err)
        return res.status(422).json({error:err})
        else
        res.json(result)

    })
})

router.put("/unlike",requireLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $pull:{likes:req.user._id}
    },{
        new:true
    }).exec((err,result)=>{
        if(err)
        return res.status(422).json({error:err})
        else 
        res.json(result)

    })
})

router.put('/comment',requireLogin,(req,res)=>{
    const comment={
        text:req.body.newComment,
        postedBy:req.user._id
    }
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{comments:comment}
    },{
        new:true
    })
    .populate("postedBy","_id name")
    .populate("comments.postedBy","_id name")
    
    .exec((err,result)=>{
        if(err)
        return res.status(422).json({error:err})
        else
        res.json(result)

    })
})

router.delete('/deletepost/:postId',requireLogin,(req,res)=>{
    Post.findOne({_id:req.params.postId})
    .populate("postedBy","_id")
    .exec((err,post)=>{
        if(err || !post)
        return res.status(422).json({error:err})
        if(post.postedBy._id.toString() === req.user._id.toString())
        {
            post.remove()
            .then(result=>{
                res.json(result)
            }).catch(err=>{
                console.log(err)
            })
        }
    })
})

router.get('/getsubpost',requireLogin,(req,res)=>{
    Post.find({postedBy:{$in:req.user.following}}) // displays all the posts in the table but doesn't display that who posted it
    .populate("postedBy","_id name") //therefore we mention it explicitly using the populate function
    .populate("comments.postedBy","_id name")
    .sort("-createdAt")
    .then(posts=>{
        res.json({posts})//show all the posts
    })
    .catch(err=>{
        console.log(err)
    })
})

router.post("/searchposts",(req,res)=>{
    let userPattern= new RegExp(req.body.query)
    Post.find({title:{$regex:userPattern}})
    .select("_id title")
    .then(post=>{
        res.json({post})
    }).catch(err=>{
        console.log(err)
    })
})

router.get("/posts/:id",requireLogin,(req,res)=>{
    Post.findOne({_id:req.params.id})
    .populate("postedBy","_id name pic")
        .then((post)=>{
            

            res.json({post})
        

    }).catch(err=>{
        console.log(err)
    })
})
router.get("/spaces/:spaceid",(req,res)=>{
    spaceid = req.params.spaceid;
    if(spaceid=="ComputerScience")
    arr = ComputerScience;
    else if(spaceid=='Electronics')
    arr = Electronics;
    else if(spaceid=='Electrical')
    arr = Electrical;
    else if(spaceid=='Biotechnology')
    arr = Biotechnology;
    else if(spaceid=='Mechanical')
    arr = Mechanical;
    else if(spaceid=='Music')
    arr = Music;
    else if(spaceid=='Dance')
    arr = Dance;
    else if(spaceid=='Literature')
    arr = Literature;
    else 
    arr = Miscellaneous;

    let ans = [];
    res.setHeader('Content-Type', 'text/html');
    for(let i = 0; i<arr.length; i++){
        Post.findOne({_id:arr[i]})
    .populate("postedBy","_id name pic")
        .then((post)=>{
            ans.push(post)
            // res.write(JSON.stringify(post))
            
    }).catch(err=>{
        console.log(err)
    })
    }
    setTimeout(()=> res.send(ans), 800)
    
   
})


module.exports=router