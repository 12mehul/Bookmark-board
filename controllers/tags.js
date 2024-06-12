const BookmarkModel = require("../models/bookmark");

//list
const getTags = async (req, res) => {
  try {
    const tags = await BookmarkModel.find({});
    return res.status(200).json({ tags });
  } catch (e) {
    return res.status(500).json({ msg: e });
  }
};

//form
const createTag = async (req, res) => {
  try {
    const { createdAt, tags, userId } = req.body;
    const newTag = await BookmarkModel.create({
      createdAt,
      tags,
      userId,
    });

    return res.status(200).json(newTag);
  } catch (e) {
    return res.status(500).json({ msg: e });
  }
};

//findOne
const getTag = async (req, res) => {
  try {
    const { id } = req.params;

    const tag = await BookmarkModel.findOne({ _id: id }).lean();
    return res.status(200).json({ tag });
  } catch (e) {
    return res.status(500).json({ msg: e });
  }
};

//update
const updateTag = async (req, res) => {
  try {
    const { id } = req.params;
    const tag = await BookmarkModel.findOneAndUpdate({ _id: id }, req.body, {
      new: true,
      runValidators: true,
    });
    if (!tag) {
      return res.status(404).json({ msg: "tag not found" });
    }
    return res.status(200).json({ tag });
  } catch (e) {
    return res.status(500).json({ msg: e });
  }
};

//delete
const deleteTag = async (req, res) => {
  try {
    const { id } = req.params;
    const tag = await BookmarkModel.findOneAndDelete({ _id: id });
    if (!tag) {
      return res.status(404).json({ msg: "tag not found" });
    }
    return res.status(200).json({ tag });
  } catch (e) {
    return res.status(500).json({ msg: e });
  }
};

module.exports = { getTags, createTag, getTag, updateTag, deleteTag };
