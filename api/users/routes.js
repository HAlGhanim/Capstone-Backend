const express = require("express");
const {
  getTemp,
  createTemp,
  updateTemp,
  deleteTemp,
  fetchTemp,
  signin,
} = require("./controllers");
const router = express.Router();
const passport = require("passport");

router.param("tempId", async (req, res, next, tempId) => {
  try {
    const foundTemp = await fetchTemp(tempId);
    if (!foundTemp) return next({ status: 404, message: "Temp not found" });
    req.temp = foundTemp;
    next();
  } catch (error) {
    return next(error);
  }
});

router.get("/", passport.authenticate("jwt", { session: false }), getTemp);
router.post("/createTemp", createTemp);
router.post(
  "/signin",
  passport.authenticate("local", { session: false }),
  signin
);
router.put("/:tempId", updateTemp);
router.delete("/:tempId", deleteTemp);

module.exports = router;
