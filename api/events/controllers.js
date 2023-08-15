const Event = require("../../models/Event");
const Tag = require("../../models/Tag");
const AI = require("../../openai");

exports.getEventById = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const event = await Event.findById(eventId)
      .populate("organizer", "username")
      .populate("attendees", "_id username")
      .populate("tags", "name");
    return res.status(200).json(event);
  } catch (error) {
    return next(error);
  }
};

exports.getEvents = async (req, res, next) => {
  try {
    const events = await Event.find()
      .populate("organizer", "username image")
      .populate("attendees", "username");
    return res.status(200).json(events);
  } catch (error) {
    return next(error);
  }
};

exports.createEvent = async (req, res, next) => {
  try {
    console.log(req.body);
    req.body.organizer = req.user._id;
    const tags = req.body.tags;
    const { latitude, longitude } = req.body;

    req.body.location = {
      type: "Point",
      coordinates: [longitude, latitude],
    };
    console.log("BEFORE CREATE", req.body);
    const newEvent = await Event.create(req.body);
    // req.body.date = new Date(req.body.date);

    await Tag.updateMany(
      { _id: tags },
      {
        $push: {
          events: newEvent._id,
        },
      }
    );
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

exports.rsvp = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const event = await Event.findByIdAndUpdate(eventId, {
      attendees: req.user,
    });
    return res.status(204).json(event);
  } catch (error) {
    return next(error);
  }
};

exports.removeRSVP = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const event = await Event.findById(eventId);

    event.attendees = event.attendees.filter(
      (attendee) => attendee.toString() !== req.user._id.toString()
    );
    await event.save();

    return res.status(204).json({ message: "RSVP removed successfully" });
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
