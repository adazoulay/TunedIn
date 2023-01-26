import React, { memo } from "react";
import { Link } from "react-router-dom";
import { useGetUserQuery } from "../users/usersApiSlice";

const PostHeader = ({ postHeaderData }) => {
  const { postId, userId, title } = postHeaderData;

  const { data: userData, isSuccess: isSuccessUser, isLoading } = useGetUserQuery(userId);

  let userContent;
  if (isSuccessUser) {
    let { ids, entities } = userData;
    let user = entities[ids[0]];
    userContent = user?.imageUrl ? (
      <div className='post-user'>
        <img src={user.imageUrl} alt='profile-picture' className='pic-small' />
        <h3 className='post-username'>{user.username}</h3>
      </div>
    ) : (
      <h3 className='post-username'>{user.username}</h3>
    );
  }

  if (isLoading) return <p>Loading...</p>;

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
