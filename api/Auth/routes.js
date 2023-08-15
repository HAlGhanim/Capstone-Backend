const express = require("express");
const passport = require("passport");
const {
  createUser,
  getUsers,
  signin,
  getUserProfile,
  checkUsername,
  checkEmail,
  updateProfile,
  fetchUser,
} = require("./controllers");
const upload = require("../../middlewares/images/multer");
const { hashing } = require("../../middlewares/password/password");
const { imageConditional } = require("../../middlewares/images/pImage");
const router = express.Router();
router.param("userId", async (req, res, next, userId) => {
  try {
    const foundUser = await fetchUser(userId);
    if (!foundUser) return next({ status: 404, message: "User not found" });
    req.foundUser = foundUser;
    next();
  } catch (error) {
    return next(error);
  }
});
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

router.get(
  "/my-profile",
  passport.authenticate("jwt", { session: false }),
  getUserProfile
);

router.post("/checkusername", checkUsername);
router.post("/checkemail", checkEmail);
router.put(
  "/:userId",
  upload.single("image"),
  passport.authenticate("jwt", { session: false }),
  updateProfile
);
module.exports = router;
