const express = require("express")
const router = express.Router()
const CatchAsync = require('../utils/CatchAsync')
const {validatePosts, isLoggedIn} = require('../middleware')
const posts = require('../controlers/posts.js')

router.route('/')
    .get(CatchAsync(posts.index))
    .post(validatePosts, isLoggedIn, CatchAsync(posts.createPost))
    
router.get('/new', CatchAsync(posts.renderNewForm))

router.route('/:id')
    .get(CatchAsync(posts.showPost))
    .put(isLoggedIn, CatchAsync(posts.editPost))
    .delete(isLoggedIn, CatchAsync(posts.deletePost))

router.get('/:id/edit', CatchAsync(posts.renderEditForm))

module.exports = router