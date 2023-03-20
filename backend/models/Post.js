const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    title: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    content: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Content",
    },
    imageUrl: {
      type: String,
    },
    views: {
      type: Number,
      default: 0,
    },
    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tag",
      },
    ],
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    isRepost: {
      type: Boolean,
      default: false,
    },
    repost: {
      originalPoster: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      originalId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
