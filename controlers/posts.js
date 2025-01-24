const Post = require('../models/posts') 
const { cloudinary } = require('../cloudinary')

module.exports.index = async (req,res)=>{
    const posts = await Post.find({}).populate('author')
    res.render('vanturepics/index', {posts})
}

module.exports.renderNewForm = (req,res)=>{
    res.render('vanturepics/new')
}

module.exports.createPost = async(req,res)=>{
    const post = new Post(req.body.posts)
    post.images = req.files.map(f => ({url:f.path, filename: f.filename}))
    post.author = req.user.id
    await post.save()
    req.flash('success','Successfuly made a new post')
    res.redirect(`/vanturepics/${post.id}`)
}

module.exports.showPost = async (req,res)=>{
    const post = await Post.findById(req.params.id)
    .populate({
        path:'comments',
        populate: {
            path:'author'
        }
    }).populate('author')
    if(!post){
        req.flash('error','Cannot find that post')
        return res.redirect('/vanturepics')
    }
    res.render('vanturepics/show', {post})
}

module.exports.renderEditForm = async (req,res) => {
    const post = await Post.findById(req.params.id)
    if(!post){
        req.flash('error', 'Campgorund not found')
        return res.redirect('/vanturepics')
    }
    res.render('vanturepics/edit', {post})
}

module.exports.editPost = async (req,res)=>{
    const {id} = req.params
    const post = await Post.findByIdAndUpdate(id, {...req.body.posts})
    const imgs = req.files.map(f => ({url:f.path, filename: f.filename}))
    post.images.push(...imgs)
    await post.save() 
    if (req.body.deleteImages) {
        for (const filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename)
        }
        await post.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages }}}})
    }
    if(!post){
        req.flash('error','Cannot find that post')
        return res.redirect('/vanturepics')
    }
    req.flash('success','Successfuly edited a post')
    res.redirect(`/vanturepics/${post.id}`)
}

module.exports.deletePost = async (req,res)=>{
    const {id} = req.params
    const post = await Post.findById(id)
    if(!post.author.equals(req.user.id)){
        req.flash('error','You do not have permition')
        return res.redirect(`/vanturepics/${post.id}`)
    }
    await Post.findByIdAndDelete(id)
    req.flash('success','Successfuly deleted a post')
    res.redirect(`/vanturepics`)
}

