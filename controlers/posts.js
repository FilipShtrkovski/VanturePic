const Post = require('../models/posts') 

module.exports.index = async (req,res)=>{
    const posts = await Post.find({})
    res.render('vanturepics/index', {posts})
}

module.exports.createPost = async(req,res)=>{
    const post = new Post(req.body.posts)
    await post.save()
    req.flash('success','Successfuly made a new post')
    res.redirect(`/vanturepics/${post.id}`)
}

module.exports.renderNewForm = async (req,res)=>{
    res.render('vanturepics/new')
}

module.exports.showPost = async (req,res)=>{
    const post = await Post.findById(req.params.id).populate('comments')
    if(!post){
        req.flash('error','Cannot find that post')
        return res.redirect('/vanturepics')
    }
    res.render('vanturepics/show', {post})
}

module.exports.editPost = async (req,res)=>{
    const {id} = req.params
    const post = await Post.findByIdAndUpdate(id, {...req.body.posts})
    await post.save()
    if(!post){
        req.flash('error','Cannot find that post')
        return res.redirect('/vanturepics')
    }
    req.flash('success','Successfuly edited a post')
    res.redirect(`/vanturepics/${post.id}`)
}

module.exports.deletePost = async (req,res)=>{
    const {id} = req.params
    await Post.findByIdAndDelete(id)
    req.flash('success','Successfuly deleted a post')
    res.redirect(`/vanturepics`)
}

module.exports.renderEditForm = async (req,res) => {
    const post = await Post.findById(req.params.id)
    res.render('vanturepics/edit', {post})
}