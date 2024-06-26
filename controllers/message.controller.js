const httpStatus = require("http-status");
const pick = require("../utils/pick");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const { messageService, chatService } = require("../services");

const createMessage = catchAsync(async (req, res) => {
  const message = await messageService.createMessage(req.body);
  res.status(httpStatus.CREATED).send(message);
});

const getMessages = catchAsync(async (req, res) => {
  const messages = await messageService.getMessagesByChatId(req.params.chatId);

  if (!messages) {
    throw new ApiError(httpStatus.NOT_FOUND, "Message not found");
  }

  res.send(messages);
});

const updateMessage = catchAsync(async (req, res) => {
  const message = await messageService.updateMessageById(
    req.params.messageId,
    req.body
  );
  res.send(message);
});

const deleteMessage = catchAsync(async (req, res) => {
  await messageService.deleteMessageById(req.params.MessageId);
  res
    .status(httpStatus.OK)
    .send({ code: httpStatus.OK, message: "Message was succesfully deleted" });
});

module.exports = {
  createMessage,
  getMessages,
  updateMessage,
  deleteMessage,
};
