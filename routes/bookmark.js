const express = require("express");
const {
  getBookmark,
  getPrivateBookmarks,
  createBookmark,
  updateBookmark,
  deleteBookmark,
  exportBookmark,
  importBookmark,
  getPublicBookmarks,
  searchBookmark,
} = require("../controllers/bookmark");
const multer = require("multer");

const router = express.Router();

//import
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/upload");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      Date.now() +
        "." +
        file.originalname.split(".")[file.originalname.split(".").length - 1]
    );
  },
});

const upload = multer({ storage: storage });

// Get a specific bookmark
router.route("/list/:id").get(getBookmark);

// Get list of bookmarks
router.route("/private/list").get(getPrivateBookmarks);
router.route("/public/list").get(getPublicBookmarks);

// Create bookmark
router.route("/create").post(createBookmark);

// Update bookmark
router.route("/update/:id").put(updateBookmark);

// Delete bookmark
router.route("/delete/:id").delete(deleteBookmark);

// Export bookmark
router.route("/export").get(exportBookmark);

// Import bookmark
router.post("/import", upload.single("file"), importBookmark);

//search bookmark
router.route("/search").get(searchBookmark);

module.exports = router;
