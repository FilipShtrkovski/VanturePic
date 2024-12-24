const express = require("express")
const app = express()
const path = require('path')
const ejsMeta = require('ejs-mate')
const Posts = require('./models/posts') 
const mongoose = require('mongoose')

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
    const posts = await Posts.findById(req.params.id)
    res.render('vanturepics/show', {posts})
})

app.listen(3000, ()=>{
    console.log('LISTENING TO PORT 3000')
})