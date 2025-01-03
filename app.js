const express = require("express")
const app = express()
const path = require('path')
const ejsMeta = require('ejs-mate')
const Post = require('./models/posts') 
const Comment = require('./models/comments') 
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const ExpressError = require('./utils/ExpressError')
const CatchAsync = require('./utils/CatchAsync')
const {validatePosts, validateComments} = require('./middleware')



mongoose.connect('mongodb://127.0.0.1:27017/vanturePic')

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected")
});

app.engine('ejs', ejsMeta)

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'))


app.get('/', (req,res)=>{
    res.render("home")
})

app.get('/vanturepics', CatchAsync(async (req,res)=>{
    const posts = await Post.find({})
    res.render('vanturepics/index', {posts})
}))

app.get('/vanturepics/new', CatchAsync(async (req,res)=>{
    res.render('vanturepics/new')
}))

app.post('/vanturepics', validatePosts, CatchAsync(async(req,res)=>{
    const post = new Post(req.body)
    await post.save()
    res.redirect(`/vanturepics/${post.id}`)
}))

app.get('/vanturepics/:id', CatchAsync(async (req,res)=>{
    const post = await Post.findById(req.params.id).populate('comments')
    res.render('vanturepics/show', {post})
}))

app.get('/vanturepics/:id/edit', CatchAsync(async (req,res) => {
    const post = await Post.findById(req.params.id)
    res.render('vanturepics/edit', {post})
}))

app.put('/vanturepics/:id', CatchAsync(async (req,res)=>{
    const {id} = req.params
    const post = await Post.findByIdAndUpdate(id, {...req.body.posts})
    await post.save()
    res.redirect(`/vanturepics/${post.id}`)
}))

app.delete('/vanturepics/:id', CatchAsync(async (req,res)=>{
    const {id} = req.params
    await Post.findByIdAndDelete(id)
    res.redirect(`/vanturepics`)
}))

app.post('/vanturepics/:id/comments', validateComments, CatchAsync( async (req,res)=>{
    const post = await Post.findById(req.params.id)
    const comment = new Comment(req.body.comments)
    post.comments.push(comment)
    await comment.save()
    await post.save()
    res.redirect(`/vanturepics/${post.id}`)
}))

app.delete('/vanturepics/:id/comments/:commentsId', CatchAsync(async (req,res)=>{
    const {id, commentsId} = req.params
    await Post.findByIdAndUpdate(id, {$pull: {comments: commentsId}})
    await Comment.findByIdAndDelete(commentsId)
    res.redirect(`/vanturepics/${id}`)
}))

app.all('*', (req,res,next)=>{
    next(new ExpressError('Page not found', 404))
})

app.use((err,req,res,next)=>{
    const {status = 500, message  } = err 
    if(!err.message) err.message = "Something went wrong"
    res.status(status).render('partials/error', {err})
})

app.listen(3000, ()=>{
    console.log('LISTENING TO PORT 3000')
})