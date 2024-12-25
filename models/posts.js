const mongoose = require('mongoose')
const Schema = mongoose.Schema

const vanturepicSchema = new Schema({
    title:String,
    description:String,
    username:String,
    location:String,
    image:String
})

module.exports = mongoose.model('Post', vanturepicSchema)