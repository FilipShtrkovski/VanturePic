const express = require("express")
const router = express.Router({mergeParams:true})
const Post = require('../models/posts') 
const Comment = require('../models/comments') 
const CatchAsync = require('../utils/CatchAsync')
const {validateComments} = require('../middleware')
const comments = require('../controlers/comments.js')

router.post('/',validateComments, CatchAsync(comments.createComment))

router.delete('/:commentsId', CatchAsync(comments.deleteComment))

module.exports = router