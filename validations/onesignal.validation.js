const Joi = require("joi");

const sendNotification = {
    body: Joi.object().keys({
        playerIds: Joi.array()
            .items(Joi.string().required())
            .min(1)
            .required(),
        notificationData: Joi.object()
            .keys({
                contents: Joi.object().keys({
                    en: Joi.string().required().messages({
                        "string.empty": "Notification content in English is required",
                    }),
                }).required(),
                headings: Joi.object().keys({
                    en: Joi.string().required().messages({
                        "string.empty": "Notification heading in English is required",
                    }),
                }).required(),
            })
            .required()
    }),
};

module.exports = {
    sendNotification,
};
