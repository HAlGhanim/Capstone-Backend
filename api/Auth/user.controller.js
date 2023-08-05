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
    const { password } = req.body;
    req.body.password = await passhash(password);
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
