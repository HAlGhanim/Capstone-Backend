const express = require("express");
const connectDb = require("./database");
const cors = require("cors");
const morgan = require("morgan");
const app = express();
const notFound = require("./middlewares/notFoundHandler");
const errorHandler = require("./middlewares/errorHandler");
const config = require("./config/keys");
const passport = require("passport");
const { localStrategy, jwtStrategy } = require("./middlewares/passport");
const authRouter = require("./api/Auth/user.route");
const chatRouter = require("./api/Chat/chat.route");
// imports needed for socket io
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

// MIDDLEWARES BEFORE
connectDb();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(passport.initialize());
passport.use(localStrategy);
passport.use(jwtStrategy);

// ROUTES
app.use("/api/auth", authRouter);
app.use("/api/chat", chatRouter);

// MIDDLEWARES AFTER
app.use(notFound);
app.use(errorHandler);
// SOCKETS ON CONNECTION
io.on("connection", (socket) => {
  console.log("a user connected");
});
// START SERVER
server.listen(config.PORT, () => {
  console.log("listening on *:", config.PORT);
});

module.exports = app;
