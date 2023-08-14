const express = require("express");
const {
  getEvents,
  createEvent,
  deleteEvent,
  getEventById,
  suggestedEvent,
  rsvp,
  removeRSVP,
} = require("./controllers");
const router = express.Router();
const passport = require("passport");
const upload = require("../../middlewares/images/multer");
const { imageConditional } = require("../../middlewares/images/pImage");
const Event = require("../../models/Event");

router.param("eventId", async (req, res, next, eventId) => {
  try {
    const foundEvent = await Event.findById(eventId);
    if (!foundEvent) return next({ status: 404, message: "Event not found" });
    req.event = foundEvent;
    next();
  } catch (error) {
    return next(error);
  }
});

router.get(
  "/suggested",
  passport.authenticate("jwt", { session: false }),
  suggestedEvent
);
router.get("/", getEvents);
router.post(
  "/createEvent",
  passport.authenticate("jwt", { session: false }),
  upload.single("image"),
  imageConditional,
  createEvent
);
router.get("/:eventId", getEventById);
router.put("/:eventId", passport.authenticate("jwt", { session: false }), rsvp);
router.put(
  "/:eventId/removeRSVP",
  passport.authenticate("jwt", { session: false }),
  removeRSVP
);
router.delete(
  "/:eventId",
  passport.authenticate("jwt", { session: false }),
  deleteEvent
);

module.exports = router;
