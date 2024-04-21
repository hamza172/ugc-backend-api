const multer = require("multer");
const { memoryStorage } = require("multer");
const AppError = require("./ApiError");


const storage = memoryStorage();

const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (req, file, callback) => {
    //   console.log("*****************" , file);
      if (file.mimetype.startsWith("image/")) {
          // For image files
          if (file.size > 1 * 1024) {
        // If image file size exceeds the limit
        const error = new AppError(
          400,
          `File size exceeds the limit for image ${file.originalname}`
        );
        callback(error, false);
      } else {
        callback(null, true);
      }
    } else if (file.mimetype.startsWith("video/")) {
      // For video files
      if (file.size > 50 * 1024 * 1024) {
        // If video file size exceeds the limit
        const error = new AppError(
          400,
          `File size exceeds the limit for video ${file.originalname}`
        );
        callback(error, false);
      } else {
        callback(null, true);
      }
    } else {
      // For unsupported file types
      const error = new AppError(
        400,
        `Unsupported file type for ${file.originalname}! Please upload only images or videos`
      );
      callback(error, false);
    }
  },
});

module.exports = upload;
