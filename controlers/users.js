const User = require('../models/user')

module.exports.renderRegister = (req,res)=>{
    res.render('users/register')
}

module.exports.register =  async (req,res,next)=>{
    try {
        const {username,email,password} = req.body
        const user = new User({username,email})
        const newUser = await User.register(user, password)
        req.login(newUser, (err)=>{
            if(err) return next(err)
            req.flash('success','Welcome to Vanturepics')
            res.redirect('/vanturepics')
        })
        
    } catch (error) {
        req.flash('error', error.message)
        res.redirect('/register')
    }
}

module.exports.loginForm = (req,res)=>{
    res.render('users/login')
}

module.exports.login = (req,res)=>{
    req.flash('success', 'Welcome back')
    const redirect = res.locals.returnTo || '/vanturepics'
    res.redirect(redirect)
}

module.exports.logout = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err)
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/vanturepics');
    })
}