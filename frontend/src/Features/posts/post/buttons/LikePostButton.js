import React, { useState, useEffect, memo } from "react";
import { useLikePostMutation, useUnLikePostMutation } from "../../postsApiSlice";
import useAuth from "../../../../hooks/useAuth";
import { Music } from "react-feather";

const LikePostButton = ({ likes, postId, repostId }) => {
  const { userId: currentUser } = useAuth();

  const [likePost] = useLikePostMutation();
  const [unLikePost] = useUnLikePostMutation();

  const [likedStatus, setLikedStatus] = useState(false);
  const [likesNumber, setLikesNumber] = useState(likes.length);

  useEffect(() => {
    if (likes && likes.includes(currentUser) && !likedStatus) setLikedStatus(true);
    setLikesNumber(likes.length);
  }, [likes, likes.length]);

  const handleLikeClicked = async () => {
    if (!likedStatus) {
      likePost({ id: postId, userId: currentUser, repostId });
      setLikedStatus(() => true);
    } else {
      const newLikes = likes.filter((id) => id !== currentUser);
      unLikePost({ id: postId, newLikes, repostId }); //! Pick one, newlikes userids
      setLikedStatus(() => false);
    }
  };

  console.log(likesNumber);
  return (
    <>
      <div className='like-icon' onClick={handleLikeClicked}>
        <Music size={29} color={likedStatus ? "#f40035" : "white"} />
      </div>
      {likesNumber}
    </>
  );
};

export default LikePostButton;
