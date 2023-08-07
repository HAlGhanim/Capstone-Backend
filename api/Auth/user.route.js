const express = require("express");
const passport = require("passport");
const { createUser, getUsers, signin } = require("./user.controller");
const upload = require("../../middlewares/images/multer");
const { hashing } = require("../../middlewares/password/password");
const { imageConditional } = require("../../middlewares/images/pImage");
const router = express.Router();

// only for testing
router.get("/users", getUsers);

router.post(
  "/register",
  upload.single("image"),
  imageConditional,
  hashing,
  createUser
);
router.post(
  "/login",
  passport.authenticate("local", { session: false }),
  signin
);
module.exports = router;
