const User = require("../../models/User");
const generateToken = require("../../utils/auth/generateToken");
const passhash = require("../../utils/auth/passhash");

exports.createUser = async (req, res, next) => {
  try {
    // if (req.file) {
    //   req.body.image = `${req.file.path.replace("\\", "/")}`;
    // }
    // if (!req.body.image)
    //   return next({ status: 400, message: "no image was uploaded!" });
    // const { password } = req.body;
    // req.body.password = await passhash(password);
    const newUser = await User.create(req.body);
    const token = generateToken(newUser);
    res.status(201).json({ token });
  } catch (error) {
    return next({ status: 400, message: error.message });
  }
};

exports.signin = async (req, res) => {
  try {
    const token = generateToken(req.user);
    return res.status(200).json({ token });
  } catch (error) {
    return next({ status: 400, message: error.message });
  }
};

exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    return res.status(200).json(users);
  } catch (error) {
    return next({ status: 400, message: error.message });
  }
};

exports.getUserProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Find the user profile based on the user ID
    const userProfile = await User.findById(userId)
      .populate("interests") // Populate interests field with referenced Tag documents
      .populate("createdEvents") // Populate createdEvents field with referenced Event documents
      .populate("attendedEvents") // Populate attendedEvents field with referenced Event documents
      .populate("chats"); // Populate chats field with referenced Chat documents

    if (!userProfile) {
      return res.status(404).json({ message: "User profile not found" });
    }

    // Return the user profile
    res.status(200).json(userProfile);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
