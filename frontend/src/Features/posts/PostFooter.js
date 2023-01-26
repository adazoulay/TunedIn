import React, { useState, useEffect } from "react";
import { useLikePostMutation } from "./postsApiSlice";
import { useUnLikePostMutation } from "./postsApiSlice";
import useAuth from "../../hooks/useAuth";
import TimeAgo from "./TimeAgo";

import CommentSection from "../comments/CommentSection";

import { Music } from "react-feather";

const PostFooter = ({ postFooterData }) => {
  const { postId, desc, createdAt, likes, views } = postFooterData;
  const { userId: currentUser } = useAuth();

  const [likePost, { isLoading }] = useLikePostMutation();
  const [unLikePost] = useUnLikePostMutation();

  const [likedStatus, setLikedStatus] = useState(false);

  if (!postId || !postFooterData) {
    return <p>Loading...</p>;
  }

  useEffect(() => {
    if (likes && likes.includes(currentUser) && !likedStatus) setLikedStatus(true);
  }, [likes]);

  const handleLikeClicked = async () => {
    if (!likedStatus) {
      const newLikes = [...likes, `${currentUser}`]; //!String string?
      likePost({ id: postId, newLikes });
      setLikedStatus(() => true);
    } else {
      const newLikes = likes.filter((id) => id !== currentUser);
      unLikePost({ id: postId, newLikes });
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
        <CommentSection postId={postId} />
      </div>
      <div className='footer-stats'>
        <div className='views'>{views} views</div>
        <div className=''>
          <TimeAgo timestamp={createdAt} />
        </div>
      </div>

      <div className='likes'>
        <div className='like-icon' onClick={handleLikeClicked}>
          <Music size={28} color={likedStatus ? "#f40035" : "white"} />
        </div>
        {likes?.length}
      </div>
    </>
  );
};

export default PostFooter;
