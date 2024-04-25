const Joi = require("joi");
const { password, objectId } = require("./custom.validation");

const createUser = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    profileName: Joi.string(),
    role: Joi.string().required().valid("user", "admin", "creator", "company"),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    companyName: Joi.string(),
    ccn: Joi.string(),
    dayOfBirth: Joi.string(),
    gender: Joi.string(),
    street: Joi.string().required(),
    houseNumber: Joi.string().required(),
    postalCode: Joi.string().required(),
    city: Joi.string().required(),
    country: Joi.string().required(),
    phoneNumber: Joi.string().required(),
    bio: Joi.string(),
    niches: Joi.string(),
    languages: Joi.string(),
  }), 
};

const getUsers = {
  query: Joi.object().keys({
    name: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
    niches: Joi.string(),
  }),
};

const getUser = {
  params: Joi.object().keys({
    userId: Joi.string().required(),
  }),
};

const updateUser = {
  params: Joi.object().keys({
    userId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      email: Joi.string().email(),
      password: Joi.string().custom(password),
      name: Joi.string(),
      postalCode: Joi.string(),
      street: Joi.string(),
      city: Joi.string(),
      slogan: Joi.string(),
      firstName: Joi.string(),
      lastName: Joi.string(),
      houseNumber: Joi.string(),
      phoneNumber: Joi.string(),
      niches: Joi.string(),
      profilePicture: Joi.string(),
      moneyBalance: Joi.number(),
    })
    .min(1),
};

const deleteUser = {
  params: Joi.object().keys({
    userId: Joi.string().required(),
  }),
};

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
};
