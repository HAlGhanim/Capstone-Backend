const { model, Schema } = require("mongoose");

const UserSchema = new Schema({
  username: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  image: { type: String, required: true },
  interests: [{ type: Schema.Types.ObjectId, ref: "Tag" }],
  createdEvents: [{ type: Schema.Types.ObjectId, ref: "Event" }],
  attendedEvents: [{ type: Schema.Types.ObjectId, ref: "Event" }],
  chat: [{ type: Schema.Types.ObjectId, ref: "Chat" }],
});

module.exports = model("User", UserSchema);
