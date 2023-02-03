import React, { memo } from "react";
import { Link } from "react-router-dom";

const PostHeader = ({ postHeaderData, userData }) => {
  const { postId, userId, title } = postHeaderData;
  const { imageUrl, username } = userData;

  let userContent = imageUrl ? (
    <div className='post-user'>
      <img src={imageUrl} alt='profile-picture' className='pic-small' />
      <h3 className='post-username'>{username}</h3>
    </div>
  ) : (
    <h3 className='post-username'>{username}</h3>
  );

  return (
    <>
      <Link to={`/user/${userId}`}>{userContent}</Link>
      <Link to={`/post/${postId}`}>
        <h2>{title}</h2>
      </Link>
    </>
  );
};

export default memo(PostHeader);
