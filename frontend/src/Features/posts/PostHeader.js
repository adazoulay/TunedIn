import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useGetTagsByPostIdQuery } from "../tags/tagsApiSlice";
import { useGetUserQuery } from "../users/usersApiSlice";
import { useSelector } from "react-redux";
import { selectPostById } from "./postsApiSlice";
import { useLikePostMutation } from "./postsApiSlice";

import AnimatedBorder from "./AnimatedBorder";
import Soundbar from "./Soundbar";
import TagGroup from "../tags/TagGroup";
import CommentSection from "../comments/CommentSection";
import TimeAgo from "./TimeAgo";

import { Music } from "react-feather";

const PostHeader = () => {
  //! User
  const [userId, setUserId] = useState("");
  const [skip, setSkip] = useState(true);

  const { data: userData, isSuccess: isSuccessUser } = useGetUserQuery(userId, { skip });
  let user;

  if (post && post.userId !== userId) {
    setUserId(post.userId);
    setSkip(false);
  }

  return <div>PostHeader</div>;
};

export default PostHeader;
