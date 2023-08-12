const Tag = require("../../models/Tag");
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
    //tags sends from the front end as an array of ids
    const tags = req.body.interests;
    console.log(req.body);

    const newUser = await User.create(req.body);

    await Tag.updateMany(
      { _id: tags },
      {
        $push: {
          interestedUsers: newUser._id,
        },
      }
    );

    const token = generateToken(newUser);
    res.status(201).json({ token });
  } catch (error) {
    return next({ status: 400, message: error.message });
  }
};

exports.signin = async (req, res) => {
  try {
    console.log(req.body);
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
    // console.log(req);
    const user = req.user;
    const profile = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User profile not found" });
    }

    return res.status(200).json(profile);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.checkUsername = async (req, res, next) => {
  try {
    console.log(req.body);
    const user = await User.findOne({ username: req.body.username });
    console.log(user);
    if (user == null) {
      return res
        .status(200)
        .json({ message: "available", username: req.body.username });
    }
    return res
      .status(200)
      .json({ message: "exist", username: req.body.username });
  } catch (error) {
    next(error);
  }
};
exports.checkEmail = async (req, res, next) => {
  try {
    const email = await User.findOne({ email: req.body.email });
    if (email == null) {
      return res
        .status(200)
        .json({ message: "available", email: req.body.email });
    }
    return res
      .status(200)
      .json({ message: "exist", email: req.body.useemailrname });
  } catch (error) {
    next(error);
  }
};
