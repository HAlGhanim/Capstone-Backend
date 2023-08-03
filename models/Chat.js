const { model, Schema } = require("mongoose");

const ChatSchema = new Schema({
  message: [{ type: Schema.Types.ObjectId, ref: "Message" }],
  members: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

module.exports = model("Chat", ChatSchema);
