const { model, Schema } = require("mongoose");

const ChatSchema = new Schema(
  {
    members: [{ type: Schema.Types.ObjectId, ref: "User" }],
    msgs: [{ type: Schema.Types.ObjectId, ref: "Msg" }],
  },
  { timestamps: true }
);

module.exports = model("Chat", ChatSchema);
