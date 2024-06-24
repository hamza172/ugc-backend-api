const httpStatus = require("http-status");
const pick = require("../utils/pick");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const { initializeApp } = require("firebase/app");
const {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
} = require("firebase/storage");

const activityService = require("../services/activity.service")

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

initializeApp(firebaseConfig);

const storage = getStorage();


const createActivity = catchAsync(async (req, res) => {
  const { body } = req;


  const activity = await activityService.createActivity({
    ...body,
    userId: Number(body.userId),
    message: body.message ? body.message : null,
    attachment: body.attachment ? body.attachment : null,
    orderId: Number(body.orderId)
  });

  res.status(httpStatus.CREATED).send(activity);
});


const getActivityByOrderId = catchAsync(async (req, res) => {
  const activity = await activityService.getActivityByOrderId(req.params.orderId);

  if (!activity) {
    throw new ApiError(httpStatus.NOT_FOUND, "activity not found");
  }
  res.send(activity);
});


module.exports = {
  createActivity,
  getActivityByOrderId
};
