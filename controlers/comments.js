const Post = require('../models/posts') 
const Comment = require('../models/comments') 

module.exports.createComment =  async (req,res)=>{
    const post = await Post.findById(req.params.id)
    const comment = new Comment(req.body.comments)
    post.comments.push(comment)
    await comment.save()
    await post.save()
    req.flash('success','Added a new comment')
    res.redirect(`/vanturepics/${post.id}`)
}

module.exports.deleteComment = async (req,res)=>{
    const {id, commentsId} = req.params
    await Post.findByIdAndUpdate(id, {$pull: {comments: commentsId}})
    await Comment.findByIdAndDelete(commentsId)
    res.redirect(`/vanturepics/${id}`)
}