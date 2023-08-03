const { model, Schema } = require("mongoose");

const EventSchema = new Schema({
  name: { type: String, unique: true, required: true },
  location: { longtitude: String, latitude: String, required: true },
  date: { type: Date, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  duration: { type: Number, required: true },
  price: { type: Number, required: true },
  tags: [{ type: Schema.Types.ObjectId, ref: "Tag" }],
  attendees: [{ type: Schema.Types.ObjectId, ref: "User" }],
  Organizer: { type: Schema.Types.ObjectId, ref: "User" },
});

module.exports = model("Event", EventSchema);
