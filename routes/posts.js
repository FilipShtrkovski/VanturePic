const express = require("express")
const router = express.Router()
const Post = require('../models/posts') 
const CatchAsync = require('../utils/CatchAsync')
const {validatePosts} = require('../middleware')

router.route('/')
    .get(CatchAsync(async (req,res)=>{
        const posts = await Post.find({})
        res.render('vanturepics/index', {posts})
    }))
    .post(validatePosts, CatchAsync(async(req,res)=>{
        const post = new Post(req.body.posts)
        await post.save()
        res.redirect(`/vanturepics/${post.id}`)
    }))
    
router.get('/new', CatchAsync(async (req,res)=>{
    res.render('vanturepics/new')
}))

router.route('/:id')
    .get(CatchAsync(async (req,res)=>{
        const post = await Post.findById(req.params.id).populate('comments')
        res.render('vanturepics/show', {post})
    }))
    .put(CatchAsync(async (req,res)=>{
        const {id} = req.params
        const post = await Post.findByIdAndUpdate(id, {...req.body.posts})
        await post.save()
        res.redirect(`/vanturepics/${post.id}`)
    }))
    .delete(CatchAsync(async (req,res)=>{
        const {id} = req.params
        await Post.findByIdAndDelete(id)
        res.redirect(`/vanturepics`)
    }))

router.get('/:id/edit', CatchAsync(async (req,res) => {
    const post = await Post.findById(req.params.id)
    res.render('vanturepics/edit', {post})
}))

module.exports = router