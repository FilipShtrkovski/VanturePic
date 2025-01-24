const {postsSchema, commentsSchema} = require('./schema.js')
const ExpressError = require('./utils/ExpressError');
const Post = require('./models/posts.js')
const Comment = require('./models/comments.js')

module.exports.isAuthor = async function (req,res,next){
    const {id} = req.params
    const post = await Post.findById(id)
    if(!id && !post.author.equals(req.user.id)){
        req.flash('error','You do not have permition')
        return res.redirect(`/vanturepics/${id}`)
    }
    next()
}

module.exports.isCommentsAuthor = async function (req,res,next){
    const {id, commentsId} = req.params
    const commen = await Comment.findById(commentsId)
    if(!id && !commen.author.equals(req.user.id)){
        req.flash('error','You do not have permition')
        return res.redirect(`/vanturepics/${id}`)
    }
    next()
}

module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl 
        req.flash('error','You must be signed in')
        return res.redirect('/login')
    }next()
}

module.exports.storeReturnTo = (req, res, next) => {
    if(req.session.returnTo){
        res.locals.returnTo = req.session.returnTo
    }
    next()
}

module.exports.validatePosts = ((req,res,next)=>{
    const {error} = postsSchema.validate(req.body)
    if(error){
        const msg = error.details.map(el=>el.message).join(',')
        throw new ExpressError(msg, 400)
    }else{
        next()
    }
})

module.exports.validateComments = ((req,res,next)=>{
    const {error} = commentsSchema.validate(req.body)
    if(error){
    const msg = error.details.map(el=>el.message).join(',')
    throw new ExpressError(msg, 400)
    }else{
        next()
    }
})
