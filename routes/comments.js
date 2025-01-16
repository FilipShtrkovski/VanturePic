const express = require("express")
const router = express.Router({mergeParams:true})
const CatchAsync = require('../utils/CatchAsync')
const {validateComments, isLoggedIn, isCommentsAuthor} = require('../middleware')
const comments = require('../controlers/comments.js')

router.post('/',validateComments, isLoggedIn, isCommentsAuthor, CatchAsync(comments.createComment))

router.delete('/:commentsId', isLoggedIn, isCommentsAuthor, CatchAsync(comments.deleteComment))

module.exports = router