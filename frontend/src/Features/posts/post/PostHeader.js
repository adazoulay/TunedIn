import React, { memo, useContext } from "react";
import { Link } from "react-router-dom";
import { PostContext } from "./Post";

const PostHeader = ({ title }) => {
  const { postId, userId, userData } = useContext(PostContext);

  let userContent = userData?.imageUrl ? (
    <div className='post-user'>
      <img src={userData?.imageUrl} alt='profile-picture' className='pic-small' />
      <h3 className='post-username'>{userData?.username}</h3>
    </div>
  ) : (
    <h3 className='post-username'>{userData?.username}</h3>
  );

  return (
    <>
      <Link to={`/user/${userId}`}>{userContent}</Link>
      <Link to={`/post/${postId}`}>
        <h2 className='post-title'>{title}</h2>
      </Link>
    </>
  );
};

export default memo(PostHeader);
