const User = require("../models/User");
const Post = require("../models/Post");
const Tag = require("../models/Tag");
const bcrypt = require("bcrypt");
const { default: mongoose } = require("mongoose");

const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password").lean();
    if (!users?.length) {
      return res.status(400).json({ message: "No users Found" });
    }
    res.json(users);
  } catch (err) {
    next(err);
  }
};

const createNewUser = async (req, res, next) => {
  const { username, email, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    const duplicateUsername = await User.findOne({ username }).lean().exec();
    if (duplicateUsername) {
      return res.status(409).json({ message: "Duplicate username" });
    }
    const duplicateEmail = await User.findOne({ email }).lean().exec();
    if (duplicateEmail) {
      return res.status(409).json({ message: "Duplicate email" });
    }

    const hashedPwd = await bcrypt.hash(password, 10);
    const userObject = { username, email, password: hashedPwd };
    const user = await User.create(userObject);

    if (user) {
      res.status(201).json({ messsage: `New user ${username} created` });
    } else {
      res.status(400).json({ message: "Invalid user data recieved" });
    }
  } catch (err) {
    next(err);
  }
};

const getUser = async (req, res, next) => {
  const id = req.params.id;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

const updateUser = async (req, res, next) => {
  const { id, username, password, desc, tags } = req.body;
  if (!id || !username) {
    return res.status(400).json({ message: "All fields are required" });
  }
  if (id !== req.user.id) {
    return res.status(403).json({ message: "JWT auth failed" });
  }
  try {
    const user = await User.findById(id).exec();
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const duplicate = await User.findOne({ username }).lean().exec();
    if (duplicate && duplicate?._id.toString() !== id) {
      return res.status(409).json({ message: "Duplicate username" });
    }
    user.username = username;
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }
    if (desc) {
      user.desc = desc;
    }
    if (tags) {
      user.tags = tags;
    }
    const updatedUser = await user.save();
    res.status(200).json({ message: `${updatedUser.username} updated` });
  } catch (err) {
    next(err);
  }
};

const deleteUser = async (req, res, next) => {
  const userId = mongoose.Types.ObjectId(req.body.id);
  //! Decide comments, liked comments, Tagged posts after, also maybe params
  if (!userId) {
    return res.status(400).json({ message: "User ID Requried" });
  }
  if (!userId.equals(req.user.id)) {
    return res.status(403).json({ message: "You can delete only your account!" });
  }
  try {
    result = await User.findByIdAndDelete(userId);
    await User.updateMany(
      { $or: [{ followers: userId }, { following: userId }] },
      { $pull: { followers: userId, following: userId } }
    );
    await Post.deleteMany({ userId: userId });
    await Post.updateMany({ likes: userId }, { $pull: { likes: userId } });
    await Post.updateMany({ comments: userId }, { $pull: { comments: userId } });
    const reply = `Username ${result.username} with ID ${result._id} deleted`;
    res.status(200).json(reply);
  } catch (err) {
    next(err);
  }
};

const follow = async (req, res, next) => {
  if (req.user.id === req.params.id) {
    return res.status(400).json("You can't follow yourself");
  }
  try {
    await User.findByIdAndUpdate(req.user.id, {
      $addToSet: { following: req.params.id },
    });
    const user = await User.findByIdAndUpdate(req.params.id, {
      $addToSet: { followers: req.user.id },
    });
    res.status(200).json(`You are now following: ${user.username}`);
  } catch (err) {
    next(err);
  }
};

const unFollow = async (req, res, next) => {
  if (req.user.id === req.params.id) {
    return res.status(400).json("You can't unfollow yourself");
  }
  try {
    await User.findByIdAndUpdate(req.user.id, {
      $pull: { following: req.params.id },
    });
    const user = await User.findByIdAndUpdate(req.params.id, {
      $pull: { followers: req.user.id },
    });
    res.status(200).json(`You are no longer following ${user.username}`);
  } catch (err) {
    next(err);
  }
};
const followTag = async (req, res, next) => {
  try {
    const tag = await Tag.findById(req.params.id).lean();
    if (!tag) {
      return res.status(400).json("Tag does not exist");
    }
    await User.findByIdAndUpdate(req.user.id, {
      $addToSet: { tags: req.params.id },
    });
    console.log(tag);
    res.status(200).json(`You are now following: ${tag.name}`);
  } catch (err) {
    next(err);
  }
};

const unFollowTag = async (req, res, next) => {
  if (req.user.id === req.params.id) {
    return res.status(400).json("You can't unfollow yourself");
  }
  try {
    await User.findByIdAndUpdate(req.user.id, {
      $pull: { following: req.params.id },
    });
    const user = await User.findByIdAndUpdate(req.params.id, {
      $pull: { followers: req.user.id },
    });
    res.status(200).json(`You are no longer following ${user.username}`);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllUsers,
  createNewUser,
  getUser,
  updateUser,
  deleteUser,
  follow,
  unFollow,
  followTag,
  unFollowTag,
};
