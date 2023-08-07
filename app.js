const express = require("express");
const connectDb = require("./database");
const cors = require("cors");
const morgan = require("morgan");
const app = express();

const notFoundHandler = require("./middlewares/errors/notFoundHandler");
const errorHandler = require("./middlewares/errors/errorHandler");
const config = require("./config/keys");
const passport = require("passport");
const {
  localStrategy,
  jwtStrategy,
} = require("./middlewares/passport/passport");
const authRouter = require("./api/Auth/user.route");
const chatRouter = require("./api/Chat/chat.route");
const eventRoutes = require("./api/events/routes");
const tagRoutes = require("./api/tags/routes");
// imports needed for socket io
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// MIDDLEWARES BEFORE
connectDb();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(passport.initialize());
passport.use(localStrategy);
passport.use(jwtStrategy);

app.use("/events", eventRoutes);
app.use("/tags", tagRoutes);
app.use("/api/auth", authRouter);
app.use("/api/chat", chatRouter);

// MIDDLEWARES AFTER
app.use(notFoundHandler);
app.use(errorHandler);
// SOCKETS ON CONNECTION
io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  socket.on("chat", (data) => {
    socket.broadcast.emit("reloadChat", data);
  });
});

// START SERVER
server.listen(config.PORT, () => {
  console.log("listening on *:", config.PORT);
});

module.exports = app;
