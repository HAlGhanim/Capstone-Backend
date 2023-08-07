const Event = require("../../models/Event");

exports.getEventById = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const event = await Event.findById(eventId);
    return res.status(200).json(event);
  } catch (error) {
    return next(error);
  }
};

exports.getEvents = async (req, res, next) => {
  try {
    const events = await Event.find().select("-__v");
    return res.status(200).json(events);
  } catch (error) {
    return next(error);
  }
};

exports.createEvent = async (req, res, next) => {
  try {
    const newEvent = await Event.create(req.body);
    res.status(201).json(newEvent);
  } catch (err) {
    return res.status(500).json(err.message);
  }
};

exports.deleteEvent = async (req, res, next) => {
  try {
    await Event.findByIdAndRemove({ _id: req.event.id });
    return res.status(204).end();
  } catch (error) {
    return next(error);
  }
};
