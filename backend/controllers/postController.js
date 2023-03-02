const User = require("../models/User");
const Post = require("../models/Post");
const Tag = require("../models/Tag");
const Content = require("../models/Content");
const fuzzyset = require("fuzzyset.js");
const { default: mongoose } = require("mongoose");
// import getMetadata from "../metadata.js";
const { getMetadata } = require("../metadata.js");

//! Feed Types
const LIMIT = 5;

const getPosts = async (req, res, next) => {
  const page = req.query.page;
  const type = req.query.type;
  let userId = null;
  let currUser = null;

  // console.log("page", page, "type", type);

  try {
    let posts;
    switch (type) {
      case "HOME":
        console.log("IN HOME");
        posts = await Post.find()
          .sort({ createdAt: -1 })
          .skip((page - 1) * LIMIT)
          .limit(LIMIT);
        break;

      case "TREND":
        console.log("IN TREND");
        posts = await Post.find()
          .sort({ views: -1, createdAt: -1 })
          .skip((page - 1) * LIMIT)
          .limit(LIMIT);
        break;

      case "SUB":
        console.log("IN SUB");
        userId = req.user.id;
        currUser = await User.findById(userId);
        const following = currUser.following;
        posts = await Promise.all(
          following.map(async (userId) => {
            return await Post.find({ userId: userId });
          })
        ).then((results) => {
          const flattenedResults = results.flat();
          const sortedResults = flattenedResults.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          return sortedResults.slice((page - 1) * LIMIT, page * LIMIT);
        });
        break;

      case "USER":
        console.log("IN USER");
        const userSource = req.query.source;
        if (!userSource) {
          return res.status(400).json({ message: "Source parameter is missing" });
        }
        const user = await User.findById(userSource).populate({
          path: "posts",
          options: {
            sort: { createdAt: -1 },
          },
        });
        if (!user) {
          return res.status(400).json({ message: "User not found" });
        }
        posts = user.posts.slice((page - 1) * LIMIT, page * LIMIT);
        break;

      case "TAG":
        console.log("IN TAG");
        const tagSource = req.query.source;
        console.log(tagSource);
        if (!tagSource) {
          return res.status(400).json({ message: "Source parameter is missing" });
        }
        const tag = await Tag.findById(tagSource).populate({
          path: "posts",
          options: {
            sort: { createdAt: -1 },
          },
        });
        if (!tag) {
          return res.status(400).json({ message: "Tag not found" });
        }
        posts = tag.posts.slice((page - 1) * LIMIT, page * LIMIT);
        break;

      case "SAVED":
        userId = req.user.id;
        if (!userId) {
          return res.status(400).json({ message: "Sign in to save posts" });
        }
        currUser = await User.findById(userId).populate({
          path: "saved",
          options: {
            sort: { createdAt: -1 },
          },
        });
        if (!currUser) {
          return res.status(400).json({ message: "User not found" });
        }
        posts = currUser.saved.slice((page - 1) * LIMIT, page * LIMIT);
        break;

      default:
        return res.status(200).json([]);
    }

    if (!posts?.length) {
      return res.status(200).json([]);
    }

    await Promise.all(
      posts.map(async (post) => {
        await post.populate("content");
      })
    );

    res.json(posts);
  } catch (err) {
    next(err);
  }
};

const getPost = async (req, res, next) => {
  const postId = req.params.id;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(400).json({ message: "Post not found" });
    }
    await post.populate("content");
    res.status(200).json(post);
  } catch (err) {
    next(err);
  }
};

const getPostByUserId = async (req, res, next) => {
  const userId = req.params.id;
  try {
    const user = await User.findById(userId).populate("posts").exec();
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const { posts } = user;
    res.status(200).json(posts);
  } catch (err) {
    next(err);
  }
};

const getPostByTagId = async (req, res, next) => {
  const tagId = req.params.id;
  try {
    const tag = await Tag.findById(tagId).populate("posts").exec();
    if (!tag) {
      return res.status(400).json({ message: "Tag not found" });
    }
    const { posts } = tag;
    res.status(200).json(posts);
  } catch (err) {
    next(err);
  }
};

const searchPost = async (req, res, next) => {
  const query = req.query.q;
  try {
    const posts = await Post.find();
    let dataSet = posts.map((post) => post.title);
    const fuzzy = fuzzyset(dataSet);
    const results = fuzzy.get(query);
    if (!results || !results.length) {
      return res.status(200).json([]);
    }
    let finalResults = results.map((result) => {
      return posts.find((post) => post.title === result[1]);
    });
    res.status(200).json(finalResults);
  } catch (err) {
    next(err);
  }
};

const getAllPosts = async (req, res, next) => {
  const posts = await Post.find();
  if (!posts?.length) {
    return res.status(400).json({ message: "No posts Found" });
  }
  res.json(posts);
};

const createNewPost = async (req, res, next) => {
  const userId = req.user.id;
  if (!userId) {
    return res.status(400).json({ message: "Create an account to post" });
  }

  const { title, desc, tags, contentUrl, contentType, fileName } = req.body;

  let metadata;
  if (contentUrl) {
    fetchedMetadata = await getMetadata(contentUrl, contentType);
    console.log("METADATA", fetchedMetadata);
    metadata = {
      title: fetchedMetadata?.common?.title,
      artist: fetchedMetadata?.common?.artist,
      lossless: fetchedMetadata?.format?.lossless,
      bitrate: fetchedMetadata?.format?.bitrate,
      sampleRate: fetchedMetadata?.format?.sampleRate,
      container: fetchedMetadata?.format?.container,
    };
    console.log("METADATA", metadata);
  }

  if (!title || !desc) {
    return res.status(400).json({ message: "Title and description are required" });
  }
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: "You must be logged in to post" });
    }
    const content = await Content.create({
      contentUrl,
      contentType,
      fileName,
      metadata: JSON.stringify(metadata),
    });

    const post = await Post.create({ userId, title, desc, content });
    if (tags && tags.length > 0) {
      await post.updateOne({ $addToSet: { tags: { $each: tags } } });
      await Tag.updateMany({ _id: { $in: tags } }, { $addToSet: { posts: post._id } });
    }

    await post.save();
    if (post) {
      await User.findByIdAndUpdate({ _id: userId }, { $addToSet: { posts: post.id } });
      return res.status(201).json({ message: "New post created" });
    } else {
      return res.status(400).json({ message: "Invalid post data received" });
    }
  } catch (err) {
    next(err);
  }
};

const updatePost = async (req, res, next) => {
  const PostId = req.params.id;
  if (!PostId) {
    return res.status(400).json({ message: "Post ID Requried" });
  }
  const { title, desc, tags } = req.body;
  try {
    const post = await Post.findById(PostId).exec();
    if (!post) {
      return res.status(400).json({ message: "Post not found" });
    }
    if (!post.userId.equals(req.user.id)) {
      return res.status(403).json({ message: "You can update only your posts!" });
    }
    if (title) {
      post.title = title;
    }
    if (desc) {
      post.desc = desc;
    }
    if (tags && tags.length > 0) {
      await post.updateOne({ $addToSet: { tags: { $each: tags } } });
      await Tag.updateMany({ _id: { $in: tags } }, { $addToSet: { posts: post._id } });
    }
    const updatedPost = await post.save();
    res.json({ message: `${updatedPost.title} updated` });
  } catch (err) {
    next(err);
  }
};

const deletePost = async (req, res, next) => {
  //TEST THAT DELETE AND UPDATE POSTS WORKS
  const PostId = req.params.id;
  if (!PostId) {
    return res.status(400).json({ message: "Post ID Requried" });
  }
  try {
    const post = await Post.findById(PostId).exec();
    if (!post.userId.equals(req.user.id)) {
      return res.status(403).json({ message: "You can delete only your posts!" });
    }
    const deletedPost = await post.deleteOne();
    await User.findByIdAndUpdate(req.user.id, {
      $pull: { posts: PostId },
    });
    await Tag.updateMany({ posts: post._id }, { $pull: { posts: post._id } });
    res.json({ message: `${deletedPost.title} deleted` });
  } catch (err) {
    next(err);
  }
};

const addView = async (req, res, next) => {
  const id = req.params.id;
  try {
    const post = await Post.findById(id);
    if (!post) {
      return res.status(400).json({ message: "Post not found" });
    }
    post.views += 1;
    const viewedPost = await post.save();
    res.status(200).json(`Post ${viewedPost.title} was viewed ${viewedPost.views} times`);
  } catch (err) {
    next(err);
  }
};

const likePost = async (req, res, next) => {
  const userId = req.user.id;
  if (!userId) {
    return res.status(400).json({ message: "You must be logged in to like a post" });
  }
  const postId = req.params.id;
  try {
    const post = await Post.findByIdAndUpdate(postId, {
      $addToSet: { likes: userId },
    });
  } catch (err) {
    next(err);
  }
};

const unLikePost = async (req, res, next) => {
  const userId = req.user.id;
  if (!userId) {
    return res.status(400).json({ message: "You must be logged in to like a post" });
  }
  const postId = req.params.id;
  try {
    const post = await Post.findByIdAndUpdate(postId, {
      $pull: { likes: userId },
    });
  } catch (err) {
    next(err);
  }
};

const savePost = async (req, res, next) => {
  const userId = req.user.id;
  const postId = req.params.id;
  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(400).json({ message: "Post not found" });
    }
    const user = await User.findByIdAndUpdate(userId, { $addToSet: { saved: postId } });
    res.status(200).json(`${user.username} added ${post.title}`);
  } catch (err) {
    next(err);
  }
};

const unSavePost = async (req, res, next) => {
  const userId = req.user.id;
  const postId = req.params.id;
  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(400).json({ message: "Post not found" });
    }
    const user = await User.findByIdAndUpdate(userId, { $pull: { saved: postId } });
    res.status(200).json(`${user.username} added ${post.title}`);
  } catch (err) {
    next(err);
  }
};

const repost = async (req, res, next) => {
  const userId = req.user.id;
  const postId = req.params.id;
  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(400).json({ message: "Post not found" });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    console.log("USER POSTS", user.posts);

    let alreadyReposted = false;
    for (let i = 0; i < user.posts.length; i++) {
      const userPost = await Post.findById(user.posts[i]);
      if (userPost.repost && userPost.repost.originalId) {
        alreadyReposted = userPost.repost.originalId.equals(post._id);
        if (alreadyReposted) break;
      }
    }

    if (alreadyReposted) {
      return res.status(400).json({ message: "You have already reposted this post" });
    }

    const now = new Date();
    const repost = new Post({
      ...post.toObject(),
      repost: {
        isRepost: true,
        originalPoster: post.userId,
        originalId: post._id,
      },
      _id: new mongoose.Types.ObjectId(),
      userId: userId,
      createdAt: now,
      updatedAt: now,
    });
    await repost.save();
    await User.findByIdAndUpdate(userId, { $addToSet: { posts: repost._id } });
    res.status(200).json(`${repost.title} reposted by ${user.username}`);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getPosts,
  getPostByUserId,
  getPostByTagId,
  searchPost,
  getAllPosts,
  getPost,
  createNewPost,
  updatePost,
  deletePost,
  addView,
  likePost,
  unLikePost,
  savePost,
  unSavePost,
  repost,
};
