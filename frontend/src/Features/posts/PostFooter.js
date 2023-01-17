import React, { useState, useEffect } from "react";
import { useLikePostMutation } from "./postsApiSlice";
import { useUnLikePostMutation } from "./postsApiSlice";
import CommentSection from "../comments/CommentSection";
import TimeAgo from "./TimeAgo";
import useAuth from "../../hooks/useAuth";
import NewComment from "../comments/NewComment";

import { Music } from "react-feather";

const PostFooter = ({ postFooterData }) => {
  const { postId, desc, createdAt, likes } = postFooterData;
  const { userId: currentUser } = useAuth();

  const [likePost, { isLoading }] = useLikePostMutation();
  const [unLikePost] = useUnLikePostMutation();

  const [likedStatus, setLikedStatus] = useState(false);

  if (!postId) {
    return <p>Loading...</p>;
  }

  useEffect(() => {
    if (likes.includes(currentUser)) setLikedStatus(true);
  }, [likes]);

  const handleLikeClicked = async () => {
    if (!likedStatus) {
      console.log("like component");
      await likePost({ id: postId, userId: currentUser });
      setLikedStatus(() => true);
    } else {
      console.log("unlike component");
      await unLikePost({ id: postId, userId: currentUser });
      setLikedStatus(() => false);
    }
  };

  return (
    <>
      <div className='description'>
        <p>{desc && desc.substring(0, 75)}</p>
      </div>
      <hr className='divider' />
      <div className='comment-section'>
        <NewComment postId={postId} />
        <CommentSection postId={postId} />
      </div>
      <div className='timestamp'>
        <TimeAgo timestamp={createdAt} />
      </div>
      <div className='likes'>
        <div className='like-icon' onClick={handleLikeClicked}>
          <Music color={likedStatus ? "red" : "white"} />
        </div>
        {likes.length}
      </div>
    </>
  );
};

export default PostFooter;
