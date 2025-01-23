const BaseJoi  = require("joi")
const sanitizeHTML = require('sanitize-html')

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value,helpers) {
                const clean = sanitizeHTML(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                })
                if(clean !== value){
                    return helpers.error('string.escapeHTML', { value })
                } return clean;
            }
        }
    }
})

const Joi = BaseJoi.extend(extension)

module.exports.postsSchema = Joi.object({
    posts:Joi.object({
        title:Joi.string().required().escapeHTML(),
        description:Joi.string().required().escapeHTML(),

    }).required(),  
    deleteImages: Joi.array()
})


module.exports.commentsSchema = Joi.object({
    comments:Joi.object({
        body:Joi.string().required().escapeHTML(),  
    }).required()  
})
