const Post = require("../models/Post");
const Tag = require("../models/Tag");
const User = require("../models/User");
const fuzzyset = require("fuzzyset.js");

const getAllTags = async (req, res, next) => {
  try {
    const tags = await Tag.find().lean();
    if (!tags?.length) {
      return res.status(400).json({ message: "No tags found" });
    }
    res.json(tags);
  } catch (err) {
    next(err);
  }
};

const createNewTag = async (req, res, next) => {
  const { name, color } = req.body;
  if (!name || !color) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    const duplicate = await Tag.findOne({ name }).lean().exec();
    if (duplicate) {
      return res.status(409).json({ message: "Duplicate tag name" });
    }
    const tagObject = { name, color };
    const tag = await Tag.create(tagObject);
    if (tag) {
      res.status(201).json({ messsage: `New tag ${name} created` });
    } else {
      res.status(400).json({ message: "Invalid tag data recieved" });
    }
  } catch (err) {
    next(err);
  }
};

const updateTag = async (req, res, next) => {
  const tagId = req.params.id;
  if (!tagId) {
    return res.status(400).json({ message: "Tag ID Requried" });
  }
  const { name, color, child, parent, post } = req.body;
  console.log(name, color, child, parent, post);
  try {
    const tag = await Tag.findById(tagId).exec();
    if (!tag) {
      return res.status(400).json({ message: "Tag not found" });
    }
    if (name) {
      const duplicate = await Tag.findOne({ name }).lean().exec();
      if (duplicate && duplicate?._id.toString() !== tagId) {
        return res.status(409).json({ message: "Duplicate tag name" });
      }
      tag.name = name;
    }
    if (color) {
      tag.color = color;
    }
    if (parent && parent.length > 0) {
      await tag.updateOne({ $addToSet: { parents: { $each: parent } } });
      await Tag.updateMany({ _id: { $in: parent } }, { $addToSet: { children: tag._id } });
    }
    if (child && child.length > 0) {
      await tag.updateOne({ $addToSet: { children: { $each: child } } });
      await Tag.updateMany({ _id: { $in: child } }, { $addToSet: { parents: tag._id } });
    }
    if (post && post.length > 0) {
      await tag.updateOne({ $addToSet: { posts: { $each: post } } });
      await Post.updateMany({ _id: { $in: post } }, { $addToSet: { tags: tag._id } });
    }
    const updatedTag = await tag.save();
    res.status(200).json({ message: `${updatedTag.name} updated` });
  } catch (err) {
    next(err);
  }
};

const deleteTag = async (req, res, next) => {
  const tagId = req.params.id;
  if (!tagId) {
    return res.status(400).json({ message: "Tag ID Requried" });
  }
  try {
    const tag = await Tag.findById(tagId).exec();
    if (!tag) {
      return res.status(400).json({ message: "Tag not found" });
    }
    await Tag.updateMany({ parents: tag._id }, { $pull: { parents: tag._id } });
    await Tag.updateMany({ children: tag._id }, { $pull: { children: tag._id } });
    await Post.updateMany({ tags: tag._id }, { $pull: { tags: tag._id } });

    await tag.remove();
    res.status(200).json({ message: `${tag.name} deleted` });
  } catch (err) {
    next(err);
  }
};

const getTag = async (req, res, next) => {
  const id = req.params.id;
  try {
    const tag = await Tag.findById(id);
    if (!tag) {
      return res.status(400).json({ message: "Tag not found" });
    }
    res.status(200).json(tag);
  } catch (err) {
    next(err);
  }
};

const getTagsByPostId = async (req, res, next) => {
  const postId = req.params.id;
  try {
    const post = await Post.findById(postId).populate("tags").exec();
    if (!post) {
      return res.status(400).json({ message: "Post not found" });
    }
    const { tags } = post;
    res.status(200).json(tags);
  } catch (err) {
    next(err);
  }
};

const getTagsByUserId = async (req, res, next) => {
  const userId = req.params.id;
  try {
    const user = await User.findById(userId).populate("tags").exec();
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const { tags } = user;
    res.status(200).json(tags);
  } catch (err) {
    next(err);
  }
};
const searchTag = async (req, res, next) => {
  const query = req.query.q;
  try {
    const tags = await Tag.find();
    let dataSet = tags.map((tag) => tag.name);
    const fuzzy = fuzzyset(dataSet);
    const results = fuzzy.get(query);
    if (!results || !results.length) {
      return res.status(200).json([]);
    }
    let finalResults = results.map((result) => {
      return tags.find((tag) => tag.name === result[1]);
    });
    res.status(200).json(finalResults);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllTags,
  createNewTag,
  updateTag,
  deleteTag,
  getTag,
  getTagsByPostId,
  getTagsByUserId,
  searchTag,
};
