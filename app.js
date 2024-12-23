const express = require("express")
const app = express()
const path = require('path')
const ejsMeta = require('ejs-mate')
const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/instagram')

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected")
});

app.engine('ejs', ejsMeta)

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.get('/', (req,res)=>{
    res.render('home')
})

app.get('/vanturepic', (req,res)=>{
    res.render('vanturepic/postfeed')
})

app.listen(3000, ()=>{
    console.log('LISTENING TO PORT 3000')
})