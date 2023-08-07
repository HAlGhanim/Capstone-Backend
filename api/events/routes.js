const express = require("express");
const {
  getEvents,
  createEvent,
  deleteEvent,
  fetchEvent,
} = require("./controllers");
const router = express.Router();
const passport = require("passport");
const upload = require("../../middlewares/images/multer");
const { imageConditional } = require("../../middlewares/images/pImage");

router.param("eventId", async (req, res, next, eventId) => {
  try {
    const foundEvent = await fetchEvent(eventId);
    if (!foundEvent) return next({ status: 404, message: "Event not found" });
    req.event = foundEvent;
    next();
  } catch (error) {
    return next(error);
  }
});

router.get("/", getEvents);
router.post(
  "/createEvent",
  passport.authenticate("jwt", { session: false }),
  upload.single("image"),
  imageConditional,
  createEvent
);
router.delete(
  "/:eventId",
  passport.authenticate("jwt", { session: false }),
  deleteEvent
);

module.exports = router;
