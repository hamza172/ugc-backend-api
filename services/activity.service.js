const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");
const Order = require("../models/order.model");
const paginate = require("../utils/paginate");
const Package = require("../models/package.model");
const { User, Offer } = require("../models");
const  Activity  = require("../models/activity.model");

/**
 * Create a activity
 * @param {Object} activityBody
 * @returns {Promise<activity>}
 */
const createActivity = async (activityBody) => {
  return await Activity.create(activityBody);
};

/**
 * Get activity by order id
 * @param {ObjectId} orderId
 * @returns {Promise<Activity>}
 */
const getActivityByOrderId = async (orderId) => {
  const activity = await Activity.findAll({
    where: { orderId },
    include: [
      { model: User, as: "user" }
    ],
  });

  return activity;
};


module.exports = {
  createActivity,
  getActivityByOrderId,
};
