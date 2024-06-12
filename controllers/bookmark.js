const BookmarkModel = require("../models/bookmark");
const fs = require("fs").promises;

//form
const createBookmark = async (req, res) => {
  try {
    const { title, url, description, createdAt, tags, username, isPrivate } =
      req.body;
    const newBookmark = await BookmarkModel.create({
      title,
      url,
      description,
      createdAt,
      tags,
      username,
      isPrivate,
    });

    return res.status(200).json(newBookmark);
  } catch (e) {
    return res.status(500).json({ msg: e });
  }
};

// import bookmark
const importBookmark = async (req, res) => {
  try {
    const bookmarks = req.file.path;
    const data = await fs.readFile(bookmarks, "utf8");
    const bookmarksData = JSON.parse(data);

    const result = await BookmarkModel.insertMany(bookmarksData);
    return res.status(200).json({ result });
  } catch (e) {
    return res.status(500).json({ msg: e });
  }
};

//list
const getPrivateBookmarks = async (req, res) => {
  try {
    const username = req.query.u;
    const bookmarks = await BookmarkModel.find(
      { username: username },
      { _id: 0 }
    );
    return res.status(200).json({ bookmarks });
  } catch (e) {
    return res.status(500).json({ msg: e });
  }
};

const getPublicBookmarks = async (req, res) => {
  try {
    const username = req.query.u;
    const bookmarks = await BookmarkModel.find(
      { username: username, isPrivate: false },
      { _id: 0 }
    );
    return res.status(200).json({ bookmarks });
  } catch (e) {
    return res.status(500).json({ msg: e });
  }
};

//search
const searchBookmark = async (req, res) => {
  try {
    const search = req.query.search;
    const regex = new RegExp(search, "i");
    const bookmarks = await BookmarkModel.find(
      { title: { $regex: regex } },
      { _id: 0 }
    );
    return res.status(200).json({ bookmarks });
  } catch (e) {
    return res.status(500).json({ msg: e });
  }
};

//findOne
const getBookmark = async (req, res) => {
  try {
    const { id } = req.params;

    const bookmark = await BookmarkModel.findOne({ _id: id }).lean();
    return res.status(200).json({ bookmark });
  } catch (e) {
    return res.status(500).json({ msg: e });
  }
};

//update
const updateBookmark = async (req, res) => {
  try {
    const { id } = req.params;
    const bookmark = await BookmarkModel.findOneAndUpdate(
      { _id: id },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!bookmark) {
      return res.status(404).json({ msg: "bookmark not found" });
    }
    return res.status(200).json({ bookmark });
  } catch (e) {
    return res.status(500).json({ msg: e });
  }
};

//delete
const deleteBookmark = async (req, res) => {
  try {
    const { id } = req.params;
    const bookmark = await BookmarkModel.findOneAndDelete({ _id: id });
    if (!bookmark) {
      return res.status(404).json({ msg: "bookmark not found" });
    }
    return res.status(200).json({ bookmark });
  } catch (e) {
    return res.status(500).json({ msg: e });
  }
};

//export
const exportBookmark = async (req, res) => {
  const username = req.query.u;
  const data = await BookmarkModel.find(
    { username: username },
    { _id: 0, isPrivate: 0 }
  );
  // ... generate bookmarks data
  const bookmarksData = JSON.stringify(data, null, 2);
  res.setHeader("Content-Type", "text/plain");
  res.setHeader("Content-Disposition", "attachment; filename=bookmarks.json");
  res.send(bookmarksData);
};

module.exports = {
  createBookmark,
  getPrivateBookmarks,
  getPublicBookmarks,
  getBookmark,
  updateBookmark,
  deleteBookmark,
  exportBookmark,
  importBookmark,
  searchBookmark,
};
