const User = require("../models/User");
const Post = require("../models/Post");
const Tag = require("../models/Tag");
const fuzzyset = require("fuzzyset.js");

const getAllPosts = async (req, res, next) => {
  try {
    const posts = await Post.find().lean();
    if (!posts?.length) {
      return res.status(400).json({ message: "No posts found" });
    }
    const postWithUser = await Promise.all(
      posts.map(async (post) => {
        const user = await User.findById(post.userId).lean().exec();
        return { ...post, username: user.username };
      })
    );
    res.json(postWithUser);
  } catch (err) {
    next(err);
  }
};

const createNewPost = async (req, res, next) => {
  //! Add mp3, imgUrl (and default) and TAGS
  const userId = req.user.id;
  if (!userId) {
    return res.status(400).json({ message: "Create an account to post" });
  }
  const { title, desc } = req.body;
  if (!title || !desc) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: "You must be logged in to post" });
    }
    const post = await Post.create({ userId, title, desc });
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
    console.log(post);
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

const getPost = async (req, res, next) => {
  const id = req.params.id;
  try {
    const post = await Post.findById(id);
    if (!post) {
      return res.status(400).json({ message: "Post not found" });
    }

    res.status(200).json(post);
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
  const UserId = req.user.id;
  if (!UserId) {
    return res.status(400).json({ message: "You must be logged in to like a post" });
  }
  const postId = req.params.id;
  try {
    const post = await Post.findByIdAndUpdate(postId, {
      $addToSet: { likes: UserId },
      //$pull: { dislikes: id }, Check if liked is not pull
    });
    res.status(200).json(`${post.title} has been liked`);
  } catch (err) {
    next(err);
  }
};

//! Need to test

const getRandom = async (req, res, next) => {
  try {
    const posts = await Post.aggregate([{ $sample: { size: 40 } }]);
    res.status(200).json(posts);
  } catch (err) {
    next(err);
  }
};

const getTrend = async (req, res, next) => {
  try {
    const posts = await Post.find().sort({ views: -1 });
    res.status(200).json(posts);
  } catch (err) {
    next(err);
  }
};

const getSub = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const following = user.following;
    const list = await Promise.all(
      following.map(async (userId) => {
        return await Video.find({ userId });
      })
    );
    res.status(200).json(list.flat().sort((a, b) => b.createdAt - a.createdAt));
  } catch (err) {
    next(err);
  }
};

const getComments = async (req, res, next) => {
  const postId = req.params.postId;
  try {
    const post = await Post.findById(postId).populate("comments").exec();
    if (!post) {
      return res.status(400).json({ message: "Post not found" });
    }
    const { comments } = post;
    res.status(200).json(comments);
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

const searchPost = async (req, res, next) => {
  const query = req.query.q;
  try {
    const posts = await Post.find();
    let dataSet = posts.map((post) => post.title);
    const fuzzy = fuzzyset(dataSet);
    const results = fuzzy.get(query);
    if (!results) {
      res.status(200).json([]);
    }
    let finalResults = results.map((result) => {
      return posts.find((post) => post.title === result[1]);
    });
    res.status(200).json(finalResults);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllPosts,
  createNewPost,
  updatePost,
  deletePost,
  getPost,
  addView,
  likePost,
  getRandom,
  getTrend,
  getSub,
  searchPost,
  getComments,
  getPostByUserId,
  getPostByTagId,
};
