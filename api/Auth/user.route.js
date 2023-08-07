const express = require("express");
const passport = require("passport");
const { createUser, getUsers, signin } = require("./user.controller");
const router = express.Router();

// only for testing
router.get("/users", getUsers);

router.post("/register", createUser);
router.post(
  "/login",
  passport.authenticate("local", { session: false }),
  signin
);
module.exports = router;
