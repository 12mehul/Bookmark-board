const express = require("express");
const {
  getUser,
  getUserList,
  userSignup,
  userLogin,
  userLogout,
} = require("../controllers/user");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

// Get a specific user
router.route("/list/:id").get(getUser);

// Get list of users
router.route("/list").get(authMiddleware,getUserList);

// User Signup
router.route("/signup").post(userSignup);

// User Login
router.route("/login").post(userLogin);

// User Logout
router.route("/logout").post(userLogout);

module.exports = router;
