const {postsSchema} = require('./schema.js')
const ExpressError = require('./utils/ExpressError');


module.exports.validatePosts = ((req,res,next)=>{
    const {error} = postsSchema.validate(req.body)
    if(error){
    const msg = error.details.map(el=>el.message).join(',')
    throw new ExpressError(msg, 400)
    }else{
        next()
    }
})
