const User = require("../models/User");
const Skill = require("../models/Skill");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    return res.status(200).json(users);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate("skills");
    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
};

exports.createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    return res.status(201).json(user);
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
  }
};
