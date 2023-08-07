const express = require("express");
const { getTags, createTag, deleteTag, fetchTag } = require("./controllers");
const router = express.Router();
const passport = require("passport");

router.param("tagId", async (req, res, next, tagId) => {
  try {
    const foundTag = await fetchTag(tagId);
    if (!foundTag) return next({ status: 404, message: "Tag not found" });
    req.tag = foundTag;
    next();
  } catch (error) {
    return next(error);
  }
});

router.get("/", getTags);
router.post("/createTag", createTag);
router.delete("/:tagId", deleteTag);

module.exports = router;
