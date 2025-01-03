const express = require("express")
const router = express.Router({mergeParams:true})
const Post = require('../models/posts') 
const Comment = require('../models/comments') 
const CatchAsync = require('../utils/CatchAsync')
const {validateComments} = require('../middleware')

router.post('/',validateComments, CatchAsync( async (req,res)=>{
        const post = await Post.findById(req.params.id)
        const comment = new Comment(req.body.comments)
        post.comments.push(comment)
        await comment.save()
        await post.save()
        res.redirect(`/vanturepics/${post.id}`)
    }))

router.delete('/:commentsId', CatchAsync(async (req,res)=>{
    const {id, commentsId} = req.params
    await Post.findByIdAndUpdate(id, {$pull: {comments: commentsId}})
    await Comment.findByIdAndDelete(commentsId)
    res.redirect(`/vanturepics/${id}`)
}))

module.exports = router