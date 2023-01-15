import React, { memo } from "react";
import { Link } from "react-router-dom";
import { useGetUserQuery } from "../users/usersApiSlice";
import { useGetTagsByPostIdQuery } from "../tags/tagsApiSlice";
import TagGroup from "../tags/TagGroup";

const PostHeader = ({ postHeaderData }) => {
  const { postId, userId, title } = postHeaderData;

  const { data: userData, isSuccess: isSuccessUser, isLoading } = useGetUserQuery(userId);

  let userContent;
  if (isSuccessUser) {
    let { ids, entities } = userData;
    let user = entities[ids[0]];
    userContent = <h3>{user.username}</h3>;
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
