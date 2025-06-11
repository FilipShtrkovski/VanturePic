if(process.env.NODE_ENV !== "production"){
    require('dotenv').config()
}

const express = require("express")
const app = express()
const path = require('path')

const ejsMeta = require('ejs-mate')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo');
const flash = require('connect-flash')
const LocalStrategy = require('passport-local')
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet')

const usersRouts = require('./routes/users')
const postRouts = require('./routes/posts')
const commentRouts = require('./routes/comments')

const mongoose = require('mongoose')
const methodOverride = require('method-override')
const ExpressError = require('./utils/ExpressError')
const User = require('./models/user')

const dbUrl = process.env.DB_URL || 'mongodb://127.0.0.1:27017/vanturePic'
 
mongoose.connect(dbUrl)

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
app.use(express.static( path.join(__dirname, 'public')))
app.use(mongoSanitize({
    replaceWith: '_',
}));

const secret = process.env.SECRET || 'thisisasecret'

const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 3600,
    crypto: {
        secret
    }
})

store.on('error', function(e){
    console.log('SESSION STORE ERROR')
})

const configSession = {
    store,
    secret,
    name: 'session',
    resave: false,
    saveUninitialized: true,
    cookie:{
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, 
        maxAge: + 1000 * 60 * 60 * 24 * 7
    } 
}

app.use(session(configSession))
app.use(flash())
app.use(helmet({contentSecurityPolicy: false}))


const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/daiuoiqvv/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
            ],
            
            scriptSrc: [
                "'self'", 
                "'unsafe-inline'", 
                "https://cdn.jsdelivr.net/",  
                "https://stackpath.bootstrapcdn.com/" 
            ],
            styleSrc: [
                "'self'", 
                "'unsafe-inline'", 
                "https://cdn.jsdelivr.net/", 
                "https://stackpath.bootstrapcdn.com/" 
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);



app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    res.locals.currentUser = req.user
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next()
})

app.use('/', usersRouts)
app.use('/vanturepics', postRouts)
app.use('/vanturepics/:id/comments', commentRouts)


app.get('/', (req,res)=>{
    res.render("home")
})

app.all('*', (req,res,next)=>{
    next(new ExpressError('Page not found', 404))
})

app.use((err,req,res,next)=>{
    const {status = 500, message  } = err 
    if(!err.message) err.message = "Something went wrong"
    res.status(status).render('partials/error', {err})
})

const port = process.env.PORT || '3000'

app.listen(port, ()=>{
    console.log(`Serving On Port ${port}`)
})