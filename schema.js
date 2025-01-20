const Joi = require("joi")

module.exports.postsSchema = Joi.object({
    posts:Joi.object({
        title:Joi.string().required(),
        description:Joi.string().required(),
        // image:Joi.string().required()  
    }).required(),  
    deleteImages: Joi.array()
})


module.exports.commentsSchema = Joi.object({
    comments:Joi.object({
        body:Joi.string().required(),  
    }).required()  
})
