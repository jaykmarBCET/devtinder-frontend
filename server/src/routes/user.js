const express =require('express');
const { userAuth } = require('../middlewares/auth');
const userRouter = express.Router();
const ConnectionRequest = require('../models/connectionRequest')
const User =require('../models/user')

//// GET ALL THE PENDING CONNECTION REQUEST FOR THE LOGGED IN USER ////

userRouter.get('/user/requests/received',userAuth,async (req,res)=>{

try {

  const loggedInUser =req.user; 
  const connectionRequests = await ConnectionRequest.find({
    toUserId: loggedInUser._id,
    status: "interested",
  }).populate("fromUserId", ["firstName", "lastName", "photoURL", "age", "skills", "about"]);

  res.json({
    message:"Data fetched succesfully",
    data:connectionRequests 
  })
  
  
} catch (error) {
    res.status(400).send("ERROR :"+ error.message)
}

});

userRouter.get('/user/connections', userAuth, async (req,res) =>{
    try {
        
        const loggedInUser =req.user;
        const connectionRequests = await ConnectionRequest.find({
            $or:[
                {toUserId:loggedInUser._id, status: "accepted"},
                {fromUserId:loggedInUser._id, status : "accepted"}
                
            ],
        }).populate('fromUserId', ["firstName", "lastName", "photoURL", "age", "skills", "about"]
        ) .populate("toUserId", ["firstName", "lastName", "photoURL", "age", "skills", "about"]);
       

        const data =connectionRequests.map((row)=>{ 
        if( row.fromUserId._id.toString() === loggedInUser._id.toString()){
           return  row.toUserId;
        }
        return row.fromUserId;
    });

        res.json({data});
 
    } catch (error) {
        res.status(400).send({message:error.message})
    }
});

userRouter.get("/feed", userAuth, async (req,res)=>{
    try {
        const loggedInUser= req.user;
        const page =parseInt(req.query.page) || 1 ;
        let limit = parseInt(req.query.limit) || 10 ;
        limit = limit > 50 ? 50 : limit;

        const skip = (page-1) * limit;
        
        const connectionRequests =await ConnectionRequest.find({
            $or :[
                {fromUserId: loggedInUser._id},{toUserId: loggedInUser._id}
            ]
        }).select("fromUserId toUserId");

        const hideUsersFromFeed = new Set();
        connectionRequests.forEach((req)=>{
            hideUsersFromFeed.add(req.fromUserId.toString());
            hideUsersFromFeed.add(req.toUserId.toString());
        });

        const users = await User.find({
            $and:[
                 {_id: { $nin: Array.from(hideUsersFromFeed)}},
                 { _id: {$ne: loggedInUser._id} }],
        }).select(["firstName", "lastName", "photoURL", "age", "skills", "about"]).skip(skip).limit(limit);
        res.json({data:users});
        // res.send(connectionRequests);
        
    } catch (error) {
        res.status(400).json({message: error.message})
    }
})




module.exports =userRouter;