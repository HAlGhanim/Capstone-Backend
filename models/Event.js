const { model, Schema } = require("mongoose");

const EventSchema = new Schema({
  name: { type: String, unique: true, required: true },
  location: {
    longitude: { type: String, required: true },
    latitude: { type: String, required: true },
  },
  date: { type: Date, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },

  // duration: { type: Number, required: true },
  time: {
    from: { type: Number, required: true },
    to: { type: Number, required: true },
  },
  price: { type: Number, required: true },
  tags: [{ type: Schema.Types.ObjectId, ref: "Tag" }],
  attendees: [{ type: Schema.Types.ObjectId, ref: "User" }],
  organizer: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

module.exports = model("Event", EventSchema);
