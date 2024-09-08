const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");

/**
 * Send notification to specific users using OneSignal API
 * @param {string[]} playerIds
 * @param {Object} notificationData
 * @returns {Promise<void>}
 */
const sendNotification = async (playerIds, notificationData) => {
    const OneSignal = require('onesignal-node');

    const client = new OneSignal.Client(process.env.ONESIGNAL_APP_ID, process.env.ONESIGNAL_SAFARI_WEB_ID);

    const notification = {
        contents: notificationData.contents, 
        headings: notificationData.headings, 
        include_player_ids: playerIds, 
    };

    try {
        await client.createNotification(notification);
    } catch (error) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to send notification");
    }
};

module.exports = {
    sendNotification,
};
