const Joi=require("joi");

const listingSchema=Joi.object({
    listing:Joi.object({
        title:Joi.string().required(),
        description:Joi.string().required(),
        price:Joi.number().required().min(2),
        location:Joi.string().required(),
        country:Joi.string().required(),
        image:Joi.string().allow("",null)
    }).required()
});                                                              




const reviewSchema=Joi.object({
    review:Joi.object({
        rating:Joi.number().required().min(1).max(5),
        comment:Joi.string().required(),
    }).required()
});

module.exports = {
  listingSchema,
  reviewSchema,
};