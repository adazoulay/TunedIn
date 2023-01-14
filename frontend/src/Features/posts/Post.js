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

// ! TODO Body content soundbar
//TODO Can react with emotes during song. Plays to other users like insta live emotes

const Post = ({ postId }) => {
  //! Post
  const post = useSelector((state) => selectPostById(state, postId));
  const [updatePost, { isLoading }] = useLikePostMutation();

  const handleLikeClicked = () => {
    console.log("liked");
    updatePost({ id: postId });
  };

  //! User
  const [userId, setUserId] = useState("");
  const [skip, setSkip] = useState(true);

  const { data: userData, isSuccess: isSuccessUser } = useGetUserQuery(userId, { skip });
  let user;

  if (post && post.userId !== userId) {
    setUserId(post.userId);
    setSkip(false);
  }

  if (isSuccessUser) {
    let { ids, entities } = userData;
    user = entities[ids[0]];
  }

  //! Tags / Colors
  const { data: tags, isSuccess: isSuccessTags } = useGetTagsByPostIdQuery(postId);
  let colors;
  if (isSuccessTags) {
    const { ids, entities } = tags;
    colors = ids.map((id) => entities[id].color);
  }

  return (
    <AnimatedBorder colors={colors}>
      <article className='post-feed'>
        <div className='post-header'>
          <Link to={`/user/${post?.userId}`}>
            <h3>{user?.username}</h3>
          </Link>
          <Link to={`/post/${postId}`}>
            {/* TODO, post page, maybe not needed? */}
            <h2>{post?.title}</h2>
          </Link>
          <div className='post-tags'>
            {isSuccessTags ? <TagGroup tags={tags} containerType={"POST"} /> : null}
          </div>
        </div>
        <div className='post-body'>
          <Soundbar />
        </div>
        <div className='post-footer'>
          <div className='description'>
            <p>{post && post?.desc.substring(0, 75)}</p>
          </div>
          <hr className='divider' />
          <div className='comment-section'>
            {post && post?.comments.length ? <CommentSection postId={postId} /> : null}
          </div>
          <div className='timestamp'>
            <TimeAgo timestamp={post?.createdAt} />
          </div>
          <div className='likes'>
            <div className='like-icon' onClick={handleLikeClicked}>
              <Music />
            </div>
            {post?.likes.length}
          </div>
        </div>
      </article>
    </AnimatedBorder>
  );
};

export default Post;
