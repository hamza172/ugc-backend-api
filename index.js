const { errorHandler, errorConverter } = require("./middlewares/error");
const { jwtStrategy } = require("./config/passport");
const ApiError = require("./utils/ApiError");
const app = require("express")();
const bodyParser = require("body-parser");
const express = require("express");
const cors = require("cors");
const httpStatus = require("http-status");
const passport = require("passport");
const routes = require("./routes");
const sequelize = require("./config/sequelize");
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const morgan = require('morgan')
const logger = require('morgan')
const socket = require("socket.io");
const http = require("http");
const { messageService } = require("./services");

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Express API for JSONPlaceholder",
    version: "1.0.0",
  },
};

const options = {
  swaggerDefinition,
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const defaultPort = 3000;
const port = process.env.PORT || defaultPort;

(async function () {
  try {
    // await sequelize.sync();
    await sequelize.sync({ alter: true });
    console.log("✅✅✅ Database sync complete.");

    const server = http.createServer(app);
    const io = socket(server, {
      cors: {
        origin:
          '*'
        // process.env.NODE_ENV === "development"
        //   ? "http://localhost:3000"
        //   : "https://www.ugc.nl",
      },
    });
    io.on("connection", (socket) => {
      console.log("Client connected:", socket.id);

      socket.on("sendMessage", async (message) => {
        const newMessage = await messageService.createMessage(message);
        io.emit("message", newMessage);
      });

      socket.on("sendoffer", async (message) => {
        io.emit("message", message);
      });


      socket.on("typing", (userId) => {
        socket.broadcast.emit("sendTyping", userId);
      });

      socket.on("stopTyping", (userId) => {
        socket.broadcast.emit("sendStopTyping", userId);
      });

      socket.on("markAsSeen", async (messageId) => {
        const updatedMessage = await messageService.markAsSeen(messageId);
        io.emit("messageSeen", updatedMessage);
      });



      socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
      });
    });


    server.listen(port, () => {
      console.log(`⚡⚡⚡ API is running on http://localhost:${port}`);
    });

    // rest of your server setup logic...
  } catch (err) {
    console.error("Failed to start server:", err);
  }
})();

app.use("/api/v1/stripe/webhook", express.raw({ type: "application/json" }));
app.use(morgan('tiny'))
app.use(logger('dev'))

app.use(express.json());

app.use(cors());

app.use(passport.initialize());
passport.use("jwt", jwtStrategy);

app.use("/api/v1", routes);

app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, "Not found"));
});

app.use(errorHandler);
app.use(errorConverter);

module.exports = app;
