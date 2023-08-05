const express = require("express");
const connectDb = require("./database");
const cors = require("cors");
const morgan = require("morgan");
const app = express();
const notFound = require("./middlewares/errors/notFoundHandler");
const errorHandler = require("./middlewares/errors/errorHandler");
const userRoutes = require("./api/users/routes");
const eventRoutes = require("./api/events/routes");
const tagRoutes = require("./api/tags/routes");
const chatRoutes = require("./api/chats/routes");
const messageRoutes = require("./api/messages/routes");
const config = require("./config/keys");
const passport = require("passport");
const {
  localStrategy,
  jwtStrategy,
} = require("./middlewares/passport/passport");

app.use(cors());
connectDb();
app.use(express.json());
app.use(morgan("dev"));

app.use(passport.initialize());
passport.use("local", localStrategy);
passport.use(jwtStrategy);

app.use("/users", userRoutes);
app.use("/events", eventRoutes);
app.use("/tags", tagRoutes);
app.use("/chats", chatRoutes);
app.use("/messages", messageRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(config.PORT, () => {
  console.log(`The application is running on: ${config.PORT}`);
});

module.exports = app;
