const { model, Schema } = require("mongoose");

const TagSchema = new Schema({
  name: { type: String, required: true },
  interestedUsers: [{ type: Schema.Types.ObjectId, ref: "User" }],
  events: [{ type: Schema.Types.ObjectId, ref: "Event" }],
});

module.exports = model("Tag", TagSchema);
