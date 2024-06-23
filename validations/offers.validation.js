const Joi = require("joi");
const { password, objectId } = require("./custom.validation");

const createOffer = {
  body: Joi.object().keys({
    numberOfVideos: Joi.number().required(),
    totalCost: Joi.number().required(),
    durationPerVideo: Joi.number().allow(null),
    voiceOver: Joi.boolean().allow(null),
    music: Joi.boolean().allow(null),
    subtitle: Joi.boolean().allow(null),
    deliveryTime: Joi.number().required(),
    expiryDate: Joi.number().allow(null),
    chatId: Joi.number(),
    description: Joi.string(),
    status: Joi.string()
  }),
};

const getOffers = {
  query: Joi.object().keys({
    name: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
    niches: Joi.string(),
  }),
};

const getOffer = {
  params: Joi.object().keys({
    OfferId: Joi.string().required(),
  }),
};

const updateOffer = {
  params: Joi.object().keys({
    OfferId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      email: Joi.string().email(),
      password: Joi.string().custom(password),
      name: Joi.string(),
    })
    .min(1),
};

const deleteOffer = {
  params: Joi.object().keys({
    OfferId: Joi.string().required(),
  }),
};

module.exports = {
  createOffer,
  getOffers,
  getOffer,
  updateOffer,
  deleteOffer,
};
