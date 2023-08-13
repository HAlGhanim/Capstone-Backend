const express = require("express");
const passport = require("passport");
const { getChatOrCreate, sendMsg, getMyChats } = require("./controllers");
const router = express.Router();

router.get("/", passport.authenticate("jwt", { session: false }), getMyChats);

router.get(
  "/:userId",
  passport.authenticate("jwt", { session: false }),
  getChatOrCreate
);

router.post(
  "/send/:chatId",
  passport.authenticate("jwt", { session: false }),
  sendMsg
);
module.exports = router;
