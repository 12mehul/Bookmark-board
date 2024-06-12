const express = require("express");
const {
  getTag,
  getTags,
  createTag,
  updateTag,
  deleteTag,
} = require("../controllers/tags");

const router = express.Router();

// Get a specific tag
router.route("/list/:id").get(getTag);

// Get list of tags
router.route("/list").get(getTags);

// Create tag
router.route("/create").post(createTag);

// Update tag
router.route("/update/:id").put(updateTag);

// Delete tag
router.route("/delete/:id").delete(deleteTag);

module.exports = router;
