const express = require("express")
const router = express.Router({mergeParams:true})
const CatchAsync = require('../utils/CatchAsync')
const passport = require('passport')
const users = require('../controlers/users.js')

router.get('/register', users.renderRegister)

router.post('/register', CatchAsync(users.register))

router.get('/login', users.loginForm)

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login)

module.exports = router