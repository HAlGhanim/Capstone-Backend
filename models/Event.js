const { model, Schema } = require("mongoose");

const EventSchema = new Schema({
  name: { type: String, unique: true, required: true },
  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
    },
    coordinates: {
      type: [Number],
      required: true,
      default: [0, 0],
    },
  },
  date: { type: Date, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  from: { type: Date, required: true },
  to: { type: Date, required: true },
  price: { type: Number, required: true, default: 0 },
  tags: [{ type: Schema.Types.ObjectId, ref: "Tag", required: true }],
  attendees: [{ type: Schema.Types.ObjectId, ref: "User" }],
  organizer: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

EventSchema.index({ location: "2dsphere" });

module.exports = model("Event", EventSchema);
