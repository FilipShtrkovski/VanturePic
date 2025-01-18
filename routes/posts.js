const express = require("express")
const router = express.Router()
const CatchAsync = require('../utils/CatchAsync')
const {validatePosts, isLoggedIn, isAuthor} = require('../middleware')
const posts = require('../controlers/posts.js')
const multer = require('multer')
const {storage} = require('../cloudinary/index.js')
const upload = multer({storage})

router.route('/')
    .get(CatchAsync(posts.index))
    .post(isLoggedIn, upload.array('image'), validatePosts, CatchAsync(posts.createPost))
    
router.get('/new', isLoggedIn, CatchAsync(posts.renderNewForm))

router.route('/:id')
    .get(CatchAsync(posts.showPost))
    .put(isLoggedIn, isAuthor, upload.array('image'), validatePosts, CatchAsync(posts.editPost))
    .delete(isLoggedIn, isAuthor, CatchAsync(posts.deletePost))

router.get('/:id/edit', isAuthor, isLoggedIn, CatchAsync(posts.renderEditForm))

module.exports = router