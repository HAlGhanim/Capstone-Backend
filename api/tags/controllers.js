const Tag = require("../../models/Tag");

exports.fetchTag = async (tagId, next) => {
  try {
    const tag = await Tag.findById(tagId);
    return tag;
  } catch (error) {
    return next(error);
  }
};

exports.getTags = async (req, res, next) => {
  try {
    const tags = await Tag.find().select("-__v");
    return res.status(200).json(tags);
  } catch (error) {
    return next(error);
  }
};

exports.createTag = async (req, res, next) => {
  try {
    const newTag = await Tag.create(req.body);
    res.status(201).json(newTag);
  } catch (err) {
    return res.status(500).json(err.message);
  }
};

exports.deleteTag = async (req, res, next) => {
  try {
    await Tag.findByIdAndRemove({ _id: req.tag.id });
    return res.status(204).end();
  } catch (error) {
    return next(error);
  }
};
