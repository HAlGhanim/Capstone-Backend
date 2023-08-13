const { model, Schema } = require("mongoose");

const PointSchema = new Schema({
  type: {
    type: String,
    enum: ["Point"],
    required: true,
  },
  coordinates: {
    type: [Number],
    required: true,
  },
});

const EventSchema = new Schema({
  name: { type: String, unique: true, required: true },
  location: { type: PointSchema, index: "2dsphere" },
  date: { type: Date, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  from: { type: Date, required: true },
  to: { type: Date, required: true },
  price: { type: Number, required: true },
  tags: [{ type: Schema.Types.ObjectId, ref: "Tag" }],
  attendees: [{ type: Schema.Types.ObjectId, ref: "User" }],
  organizer: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

module.exports = model("Event", EventSchema);
