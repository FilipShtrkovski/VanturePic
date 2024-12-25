const express = require("express")
const app = express()
const path = require('path')
const ejsMeta = require('ejs-mate')
const Posts = require('./models/posts') 
const mongoose = require('mongoose')
const methodOverride = require('method-override')

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

app.get('/', async (req,res)=>{
    res.render('home')
})

app.get('/vanturepics', async (req,res)=>{
    const posts = await Posts.find({})
    res.render('vanturepics/index', {posts})
})

app.get('/vanturepics/new', async (req,res)=>{
    res.render('vanturepics/new')
})

app.post('/vanturepics', async(req,res)=>{
    const post = new Posts(req.body)
    await post.save()
    console.log(post)
    res.redirect('/vanturepics')
})

app.get('/vanturepics/:id', async (req,res)=>{
    const post = await Posts.findById(req.params.id)
    res.render('vanturepics/show', {post})
})

app.get('/vanturepics/:id/edit', async (req,res) => {
    const post = await Posts.findById(req.params.id)
    res.render('vanturepics/edit', {post})
})

app.put('/vanturepics/:id', async (req,res)=>{
    const {id} = req.params
    const post = await Posts.findByIdAndUpdate(id, {...req.body})
    await post.save()
    res.redirect(`/vanturepics/${post.id}`)
})

app.delete('/vanturepics/:id', async (req,res)=>{
    const {id} = req.params
    await Posts.findByIdAndDelete(id)
    res.redirect(`/vanturepics`)
})

app.listen(3000, ()=>{
    console.log('LISTENING TO PORT 3000')
})