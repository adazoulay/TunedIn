const User = require("../models/User");
const Post = require("../models/Post");
const Comment = require("../models/Comment");

const getAllComments = async (req, res, next) => {
  try {
    const comments = await Comment.find().lean();
    if (!comments?.length) {
      return res.status(400).json({ message: "No comments found" });
    }
    const commentWithUser = await Promise.all(
      comments.map(async (comment) => {
        const user = await User.findById(comment.userId).lean().exec();
        return { ...comment, username: user.username };
      })
    );
    res.json(commentWithUser);
  } catch (err) {
    next(err);
  }
};

const createNewComment = async (req, res, next) => {
  const userId = req.user.id;
  const postId = req.params.id;
  if (!userId) {
    return res.status(400).json({ message: "Create an account to post" });
  }
  const { desc } = req.body;
  if (!desc) {
    return res.status(400).json({ message: "Comment body is required" });
  }
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: "You must be logged in to post" });
    }
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(400).json({ message: "Post not found" });
    }
    const comment = await Comment.create({ userId, desc });
    await post.update({ $addToSet: { comments: comment._id } });
    return res.status(201).json({ message: `${user.username} commented ${post.title}` });
  } catch (err) {
    next(err);
  }
};

const updateComment = async (req, res, next) => {
  const commentId = req.params.id;
  if (!commentId) {
    return res.status(400).json({ message: "Comment ID Requried" });
  }
  const { desc } = req.body;
  try {
    const comment = await Comment.findById(commentId).exec();
    if (!comment) {
      return res.status(400).json({ message: "Comment not found" });
    }
    if (!comment.userId.equals(req.user.id)) {
      return res.status(403).json({ message: "You can update only your own comments!" });
    }
    if (desc) {
      comment.desc = desc;
    }
    const updatedComment = await comment.save();
    res.json({ message: `${updatedComment._id} updated` });
  } catch (err) {
    next(err);
  }
};

const deleteComment = async (req, res, next) => {
  const commentId = req.params.id;
  if (!commentId) {
    return res.status(400).json({ message: "Comment ID Requried" });
  }
  try {
    const comment = await Comment.findById(commentId).exec();
    if (!comment) {
      return res.status(400).json({ message: "Comment not found" });
    }
    if (!comment.userId.equals(req.user.id)) {
      return res.status(403).json({ message: "You can delete only your comments!" });
    }
    const deletedComment = await Comment.deleteOne();
    await Post.updateOne(
      { comments: commentId },
      {
        $pull: { comments: comment._id },
      }
    );
    res.json({ message: `Comment deleted` });
  } catch (err) {
    next(err);
  }
};

const getComment = async (req, res, next) => {
  const id = req.params.id;
  try {
    const comment = await Comment.findById(id).lean();
    if (!comment) {
      return res.status(400).json({ message: "Comment not found" });
    }
    const user = await User.findById(comment.userId).lean().exec();
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    res.status(200).json({ ...comment, username: user.username });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllComments,
  createNewComment,
  updateComment,
  deleteComment,
  getComment,
};
