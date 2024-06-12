const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/user");

const getUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await UserModel.findOne({ _id: userId });

    if (!user) {
      return res.status(404).json({ msg: "user not found" });
    }

    return res.status(200).json({ user });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ msg: e });
  }
};

//list
const getUserList = async (req, res) => {
  try {
    const users = await UserModel.find({});
    res.status(200).json({ users });
  } catch (err) {
    res.status(500).json({ msg: err });
  }
};

//signup
const userSignup = async (req, res) => {
  try {
    const { email, password, firstname, lastname, username } = req.body;
    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await UserModel.create({
      email,
      password: hashedPassword,
      firstname,
      lastname,
      username,
    });

    const result = await user.save();

    return res.status(201).json({ result });
  } catch (err) {
    return res.status(500).json({ msg: err });
  }
};

//login
const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email }).lean();

    if (!user) {
      return res
        .status(404)
        .json({ msg: `User not available with the email id: ${email}` });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(400).send({ msg: `invalid password` });
    }

    const token = jwt.sign({ _id: user._id }, "secret");

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    const payload = {
      message: "Login successful",
      roles: "USERROLES",
      token: token,
    };

    res.status(201).send({
      msg: payload.message,
      roles: payload.roles,
      access_token: payload.token,
      user,
    });
  } catch (err) {
    res.status(500).json({ msg: err });
  }
};

//logout
const userLogout = (req, res) => {
  res.cookie("jwt", "", { maxAge: 0 });
  res.send({ msg: "succes" });
};

module.exports = {
  getUser,
  getUserList,
  userSignup,
  userLogin,
  userLogout,
};
