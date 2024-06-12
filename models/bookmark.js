const mongoose = require("mongoose");

const BookmarkSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  title: {
    type: String,
  },
  url: {
    type: String,
  },
  description: {
    type: String,
  },
  tags: [
    {
      name: String,
    },
  ],
  isPrivate: {
    type: Boolean,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

const BookmarkModel = mongoose.model("Bookmark", BookmarkSchema, "Bookmarks");

module.exports = BookmarkModel;
