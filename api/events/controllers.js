const Event = require("../../models/Event");
const AI = require("../../openai");
exports.getEventById = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const event = await Event.findById(eventId).populate(
      "organizer",
      "username"
    );
    return res.status(200).json(event);
  } catch (error) {
    return next(error);
  }
};

exports.getEvents = async (req, res, next) => {
  try {
    const events = await Event.find().populate("organizer", "username image");
    return res.status(200).json(events);
  } catch (error) {
    return next(error);
  }
};

exports.createEvent = async (req, res, next) => {
  try {
    req.body.organizer = req.user._id;
    req.body.date = new Date(req.body.date);
    const newEvent = await Event.create(req.body);
    await req.user.updateOne({ $push: { createdEvents: newEvent._id } });
    res.status(201).json(newEvent);
  } catch (err) {
    return res.status(500).json(err.message);
  }
};

exports.deleteEvent = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const event = await Event.findById(eventId);
    if (event) {
      if (req.user._id.equals(event.organizer)) {
        await event.deleteOne();
        return res.status(204).json({ message: "event is deleted" });
      }
      return res
        .status(401)
        .json({ message: " you're not the creater of this event" });
    }
    return res.status(204).end();
  } catch (error) {
    return next(error);
  }
};

exports.suggestedEvent = async (req, res, next) => {
  try {
    const user = await req.user.populate({
      //pouplate interest and show name only
      path: "interests",
      select: "name",
    });
    // console.log("heree", user);
    const events = await Event.find({
      date: {
        //gt greater then
        $gt: new Date(),
      },
    })
      .select("_id name tags date description")
      .populate("tags", "name -_id");

    const userInterests = { interests: user.interests.map((i) => i.name) };
    const eventsAI = events.map((event) => ({
      _id: event._id,
      name: event.name,
      date: event.date,
      description: event.description,

      tags: event.tags.map((tag) => tag.name),
    }));
    // console.log(eventsAI, userInterests);
    const suggestion = await AI(userInterests, eventsAI);
    const suggestionEvents = await Event.find({
      _id: suggestion.events,
    }).populate("organizer", "username image");
    return res.status(200).json(suggestionEvents);
  } catch (error) {
    return next(error);
  }
};
//ALi123!@#
