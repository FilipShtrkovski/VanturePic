const mongoose = require('mongoose')
const Comments = require('./comments')
const User = require('./user')
const Schema = mongoose.Schema

const VanturepicSchema = new Schema({
    title:String,
    description:String,
    location:String,
    image:String,
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