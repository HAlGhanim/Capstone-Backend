const { model, Schema } = require("mongoose");

const UserSchema = new Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  chats: [{ type: Schema.Types.ObjectId, ref: "Chat" }],
});

module.exports = model("User", UserSchema);
