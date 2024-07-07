const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const {
  authService,
  userService,
  tokenService,
  emailService,
  packageService,
  uploadService,
} = require("../services");
const Uploader = require("../utils/uploader");

const register = catchAsync(async (req, res) => {
  let User;
  console.log(req.body)
  if (!(req.files && Object.keys(req.files).length >= 1)) {
    User = await userService.createUser(req.body);
  } else {
    // -------------------- UPLOADING --------------------------------------
    //1. Upload the profile picture to S3 Storage
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

    let { niches, languages } = req.body;
    if (niches) {
      niches = JSON.parse(niches?.replace(/'/g, '"'));
    }

    if (languages) {
      languages = JSON.parse(languages?.replace(/'/g, '"'));
    }

    const newUser = {
      ...req.body,
      profilePicture: profileLink,
      role: req?.body?.role || "creator",
      niches: niches ? niches : null,
      languages: languages ? languages : null,
      isEmailVerified: true,
      video1: videoUrl1 ? videoUrl1 : null,
      video2: videoUrl2 ? videoUrl2 : null,
      video3: videoUrl3 ? videoUrl3 : null,
      video4: videoUrl4 ? videoUrl4 : null,
    };
    User = await userService.createUser(newUser);
  }

  const tokens = await tokenService.generateAuthTokens(User);
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(User);

  if (User.role === "creator") {
    await emailService.sendCreatorRegistrationConfirmationEmail(
      User.email,
      User
    );
  } else {
    await emailService.sendBuyerRegistrationConfirmationEmail(User.email, User);
  }

  res.status(httpStatus.CREATED).send({ User, tokens });
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateAuthTokens(user);

  res.send({ user, tokens });
});

const logout = catchAsync(async (req, res) => {
  await authService.logout(req.body.refreshToken);
  res.send({ message: "Logged out" });
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  res.send({ ...tokens });
});

const forgotPassword = catchAsync(async (req, res) => {
  const resetPasswordToken = await tokenService.generateResetPasswordToken(
    req.body.email
  );
  await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const resetPassword = catchAsync(async (req, res) => {
  await authService.resetPassword(req.query.token, req.body.password);
  res.json({ status: "success" });
});

const sendVerificationEmail = catchAsync(async (req, res) => {
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(
    req.user
  );
  await emailService.sendVerificationEmail(req.user.email, verifyEmailToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const verifyEmail = catchAsync(async (req, res) => {
  await authService.verifyEmail(req.query.token);
  res.json({ status: "success" });
});

const changePassword = catchAsync(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  await authService.changePassword(req.user.id, oldPassword, newPassword);
  res.status(httpStatus.OK).send({ message: "Password changed successfully" });
});

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  sendVerificationEmail,
  verifyEmail,
  changePassword,
};
