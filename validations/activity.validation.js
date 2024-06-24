const Joi = require("joi");
const { objectId } = require("./custom.validation");

const createActivity = {
  body: Joi.object().keys({
    message: Joi.string().allow(null),
    attachment: Joi.string().allow(null),
    userId: Joi.number().integer(),
    orderId: Joi.number().integer()
  }),
};

const getActivityByOrderId = {
  query: Joi.object().keys({
    orderId: Joi.number().integer()
  }),
};


module.exports = {
    createActivity,
    getActivityByOrderId
  };
  