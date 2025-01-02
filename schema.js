const Joi = require("joi")

module.exports.postsSchema = Joi.object({
    posts:Joi.object({
        title:Joi.string().required(),
        description:Joi.string().required(),
        username:Joi.string().required(),
        image:Joi.string().required()  
    }).required()  
})

