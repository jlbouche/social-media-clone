const express=require('express')
const authMiddleware = require('../middleware/authMiddleware')
const router=express.Router()
const UserModel=require('../models/UserModel')
const ProfileModel=require('../models/ProfileModel')
const FollowerModel=require('../models/FollowerModel')
const PostModel=require('../models/PostModel')

//GET PROFILE INFO
router.get('/:username', authMiddleware, async(req,res)=>{
    const {username} = req.params;

    try {
        const user = await UserModel.findOne({username: username.toLowerCase()})
        if(!user){
            return res.status(404).send('User not found')
        }

        const profile= await ProfileModel.findOne({user: user._id}).populate('user')

        const profileFollowStats = await FollowerModel.findOne({user: user._id});

        return res.json({
            profile,
            followersLength: 
                profileFollowStats.followers.length>0 ? 
                profileFollowStats.followers.length
                : 0,
            followingLength: 
                profileFollowStats.following.length > 0 ? 
                profileFollowStats.following.length
                : 0
        })

    } catch (error) {
        console.log(error);
        return res.status(500).send(`Server error`);
    }
})

//GET POSTS FROM USER

router.get('/posts/:username', authMiddleware, async(req, res)=>{

    const {username} = req.params

    try {
        
        const user = await UserModel.findOne({username: username.toLowerCase()})
        if(!user){
            return res.status(404).send('User not found')
        }

        const posts = await PostModel.find({user: user._id})
            .sort({createdAt: -1})
            .populate('user')
            .populate('comments.user')

        return res.json(posts);

    } catch (error) {
        console.log(error)
        return res.status(500).send(`Server error`);
    }
})

//GET FOLLOWERS 

router.get('/followers/:userId', authMiddleware, async(req, res)=> {

    const {userId} = req.params;

    try {
        
        const user = await FollowerModel.findOne({user: userId}).populate('followers.user');

        return res.json(user.followers);

    } catch (error) {
        console.log(error)
        return res.status(500).send(`Server error`);
    }
})


//GET FOLLOWING

router.get('/following/:userId', authMiddleware, async(req, res)=> {

    const {userId} = req.params;

    try {
        
        const user = await FollowerModel.findOne({user: userId}).populate('following.user');

        return res.json(user.following);

    } catch (error) {
        console.log(error)
        return res.status(500).send(`Server error`);
    }
})

//FOLLOW A USER

router.post('/follow/:userToFollowId', authMiddleware, async(req, res)=>{

    const {userId} = req
    const userToFollowId = req.params

    try {
        
        const user = await FollowerModel.findOne({user: userId})
        const userToFollow = await FollowerModel.findOne({user: userToFollowId})

        if(!user || !userToFollow){
            return res.status(404).send('User not found')
        }

        const isFollowing = 
            user.following.length > 0 && 
            user.following.filter(
                following => following.user.toString() === userToFollowId
                ).length > 0;

        if(isFollowing){
            return res.status(401).send('Already following this user')
        }

        await user.following.unshift({user: userToFollowId})
        await user.save()

        await userToFollow.followers.unshift({user: userId})
        await userToFollow.save()

        return res.status(200).send('Successfully followed')

    } catch (error) {
        console.log(error)
        return res.status(500).send(`Server error`);
    }

})

//UNFOLLOW A USER

router.put('/unfollow/:userToUnfollowId', authMiddleware, async(req, res)=> {

    const {userId} = req
    const {userToUnfollowId} = req.params

    try {
        
        const user = await FollowerModel.findOne({user: userId})
        const userToUnfollow = await FollowerModel.findOne({user: userToUnfollowId})

        if(!user || !userToUnfollow){
            return res.status(404).send('User not found')
        }

        const isFollowing = 
            user.following.length > 0 && 
            user.following.filter(
                following=>following.user.toString() === userToUnfollowId
            ).length === 0;

        if(isFollowing){
            return res.status(401).send('User not followed');
        }

        const removeFollowing = user.following.map(following => following.user.toString()).indexOf(userToUnfollowId)

        await user.following.splice(removeFollowing, 1)
        await user.save()

        const removeFollower= userToUnfollow.followers.map(follower => follower.user.toString()).indexOf(userId)

        await userToUnfollow.followers.splice(removeFollower)

        return res.status(200).send('Successfully unfollowed')

    } catch (error) {
        console.log(error)
        return res.status(500).send(`Server error`);
    }
})


module.exports=router