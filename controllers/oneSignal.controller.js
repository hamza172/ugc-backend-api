const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const { onesignalService } = require("../services");

/**
 * Send notification to specific users
 */
const sendNotification = catchAsync(async (req, res) => {
    const { playerIds, notificationData } = req.body;

    if (!playerIds || playerIds.length === 0) {
        throw new ApiError(httpStatus.BAD_REQUEST, "No player IDs provided");
    }

    if (!notificationData || !notificationData.contents || !notificationData.headings) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Invalid notification data");
    }

    await onesignalService.sendNotification(playerIds, notificationData);

    res.status(httpStatus.OK).send({
        code: httpStatus.OK,
        message: "Notification sent successfully",
    });
});

module.exports = {
    sendNotification,
};
