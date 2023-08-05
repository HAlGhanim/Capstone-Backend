const { model, Schema } = require("mongoose");

const MsgSchema = new Schema(
  {
    chat: { type: Schema.Types.ObjectId, ref: "Chat" },
    msg: { type: String },
    from: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = model("Msg", MsgSchema);
