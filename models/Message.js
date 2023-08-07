const { model, Schema } = require("mongoose");

const MessageSchema = new Schema(
  {
    message: { type: String, required: true },
    chat: { type: Schema.Types.ObjectId, ref: "Chat" },
    sender: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = model("Message", MessageSchema);
