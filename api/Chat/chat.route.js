const express = require("express");
const passport = require("passport");
const { getChatOrCreate, sendMsg } = require("./chat.controller");
const router = express.Router();

router.post(
  "/:userId",
  passport.authenticate("jwt", { session: false }),
  getChatOrCreate
);

router.post(
  "/:chatId",
  passport.authenticate("jwt", { session: false }),
  sendMsg
);
module.exports = router;
