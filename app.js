const express = require("express")
const app = express()
const path = require('path')
const ejsMeta = require('ejs-mate')
const Posts = require('./models/posts') 
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const ExpressError = require('./utils/ExpressError')
const CatchAsync = require('./utils/CatchAsync')
const {postsSchema} = require('./schema.js')
const Joi = require("joi")


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


const validatePosts = ((req,res,next)=>{
    const postsSchema = Joi.object({
        title:Joi.string().required(),
        description:Joi.string().required(),
        username:Joi.string().required(),
        image:Joi.string().required() 
    })
    const {error} = postsSchema.validate(req.body)
    if(error){
        const msg = error.details.map(el=>el.message).join(',')
        throw new ExpressError(msg, 400)
    }else{
        next()
    }
})

app.get('/', (req,res)=>{
    res.render("home")
})

app.get('/vanturepics', CatchAsync(async (req,res)=>{
    const posts = await Posts.find({})
    res.render('vanturepics/index', {posts})
}))

app.get('/vanturepics/new', CatchAsync(async (req,res)=>{
    res.render('vanturepics/new')
}))

app.post('/vanturepics', validatePosts, CatchAsync(async(req,res)=>{
    const post = new Posts(req.body)
    await post.save()
    res.redirect(`/vanturepics/${post.id}`)
}))

app.get('/vanturepics/:id', CatchAsync(async (req,res)=>{
    const post = await Posts.findById(req.params.id)
    res.render('vanturepics/show', {post})
}))

app.get('/vanturepics/:id/edit', CatchAsync(async (req,res) => {
    const post = await Posts.findById(req.params.id)
    res.render('vanturepics/edit', {post})
}))

app.put('/vanturepics/:id', CatchAsync(async (req,res)=>{
    const {id} = req.params
    const post = await Posts.findByIdAndUpdate(id, {...req.body})
    await post.save()
    res.redirect(`/vanturepics/${post.id}`)
}))

app.delete('/vanturepics/:id', CatchAsync(async (req,res)=>{
    const {id} = req.params
    await Posts.findByIdAndDelete(id)
    res.redirect(`/vanturepics`)
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