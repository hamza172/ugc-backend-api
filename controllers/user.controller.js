const httpStatus = require("http-status");
const pick = require("../utils/pick");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const { userService } = require("../services");
const { Op } = require("sequelize");
const Uploader = require("../utils/uploader");

const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const getUsers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ["name", "role", "niches",'topCreator']);

  const filters = {
    ...filter,
    ...(req.query.niches && {
      niches: {
        [Op.contains]: [req.query.niches],
      },
    }),
  };

  const options = pick(req.query, ["sortBy", "limit", "page"]);
  const result = await userService.queryUsers(filters, options);
  res.send(result);
});

const getUserMoneySummary = catchAsync(async(req,res) =>{
  const result = await userService.getUserByIdMoneySummary(req.params.userId)
  res.send(result);
})

const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId);

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  res.send({ code: httpStatus.OK, message: "Got user !", user });
});

const updateUser = catchAsync(async (req, res) => {
  let user
  if (!(req.files && Object.keys(req.files).length >= 1)) {
    user = await userService.updateUserById(req.params.userId, req.body);
  } else {

    const { profilePicture, video1, video2, video3, video4 } = req.files;
    let profileLink = null;
    if (profilePicture) {
      profileLink = await Uploader({
        location: "aws_s3",
        file: profilePicture[0],
        sizeLimit: true,
      });
    }

    //2. Upload video content to user profile
    let videoUrl1 = null;
    let videoUrl2 = null;
    let videoUrl3 = null;
    let videoUrl4 = null;

    if (video1) {
      videoUrl1 = await Uploader({ location: "firebase", file: video1[0] });
    }
    if (video2) {
      videoUrl2 = await Uploader({ location: "firebase", file: video2[0] });
    }
    if (video3) {
      videoUrl3 = await Uploader({ location: "firebase", file: video3[0] });
    }
    if (video4) {
      videoUrl4 = await Uploader({ location: "firebase", file: video4[0] });
    }
    //-----------------------------------------------------------------------------
    const updatedUser = {
      ...req.body,
      profilePicture: profileLink,
      video1: videoUrl1 ? videoUrl1 : null,
      video2: videoUrl2 ? videoUrl2 : null,
      video3: videoUrl3 ? videoUrl3 : null,
      video4: videoUrl4 ? videoUrl4 : null,
      // availability: req.body.availability === 'true' ? true : false
    };
    user = await userService.updateUserById(req.params.userId, updatedUser);
    console.log("asd: ", req.params.userId, req.body)

  }
  if (!user) {
    res.send({
      code: httpStatus.INTERNAL_SERVER_ERROR,
      message: "Failed to update user !",
    });
    return;
  }
  res.send({
    code: httpStatus.OK,
    message: "User updated successfully !",
    user,
  });
});

const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUserById(req.params.userId);
  res
    .status(httpStatus.OK)
    .send({ code: httpStatus.OK, message: "User was succesfully deleted" });
});

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getUserMoneySummary,
};
