const Chat = require("../../models/Chat");
const Msg = require("../../models/Msg");
const User = require("../../models/User");
const { Expo } = require("expo-server-sdk");

exports.getChatOrCreate = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const foundUser = await User.findById(userId).populate("chats");
    if (!foundUser) return next({ message: "User not found", status: 404 });
    const foundChat = foundUser.chats.find((chat) => {
      return chat.members.find((member) => {
        return req.user._id.equals(member);
      });
    });
    if (!foundChat) {
      const createdChat = await Chat.create({
        members: [req.user._id, foundUser._id],
      });
      await req.user.updateOne({ $push: { chats: createdChat._id } });
      await foundUser.updateOne({ $push: { chats: createdChat._id } });
      return res.status(201).json(createdChat);
    }
    const chat = await Chat.findById(foundChat._id).populate("msgs");
    return res.status(200).json(chat);
  } catch (error) {
    next(error);
  }
};

exports.sendMsg = async (req, res, next) => {
  try {
    const { chatId } = req.params;
    const foundChat = await Chat.findById(chatId);
    if (!foundChat) {
      return next({ message: "Chat not found!", statu: 404 });
    }
    const msg = await Msg.create({
      chat: foundChat._id,
      from: req.user._id,
      msg: req.body.msg,
    });

    // Send push notifications to other users in the chat
    const senderId = req.user._id.toString();

    const otherUserIds = foundChat.members.filter(
      (member) => member.toString() !== senderId.toString()
    );
    const otherUsers = await User.find({ _id: { $in: otherUserIds } });
    console.log("this is user", req.user._id.toString());
    console.log("this is otherrrr", otherUserIds.toString());

    const expo = new Expo();
    const messages = otherUsers.map((user) => ({
      to: user.expoPushToken,
      sound: "default",
      body: `New message from ${req.user.username}: ${req.body.msg}`,
      data: { chatId: foundChat._id, user: otherUserIds.toString() },
    }));

    const chunks = expo.chunkPushNotifications(messages);
    for (const chunk of chunks) {
      await expo.sendPushNotificationsAsync(chunk);
    }
    await foundChat.updateOne({ $push: { msgs: msg } });
    return res.status(201).json(foundChat);
  } catch (error) {
    next(error);
  }
};

exports.getMyChats = async (req, res, next) => {
  try {
    const chats = await User.findById(req.user._id)
      .select("chats -_id")
      .populate({
        path: "chats",
        populate: "members msgs",
        select: "username _id image",
      });
    return res.status(200).json(chats.chats);
  } catch (error) {
    next(error);
  }
};
