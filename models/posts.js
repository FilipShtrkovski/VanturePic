const mongoose = require('mongoose')
const Comments = require('./comments')
const User = require('./user')
const Schema = mongoose.Schema

const ImageSchema = new Schema({
    url:String,
    filename:String
})

ImageSchema.virtual('thumbnail').get(function() {
    return this.url.replace('/upload', '/upload/w_100/h_100')
})

const VanturepicSchema = new Schema({
    title:String,
    description:String,
    location:String,
    images:[ImageSchema],
    comments:[{
        type: Schema.Types.ObjectId, ref:"Comment"
    }],
    author:{
        type: Schema.Types.ObjectId, ref:"User"
    }
})

VanturepicSchema.post('findOneAndDelete', async function(doc){
    if(doc){
       await Comments.deleteMany({_id:{$in: doc.comments}}) 
    }
    
})

module.exports = mongoose.model('Post', VanturepicSchema)