import React from "react";
import Post from "./Post";

const PostList = ({ feedData }) => {
  const { data: posts, isLoading, isSuccess, isError, error } = feedData;

  let content;

  if (isLoading) {
    content = <p>Loading2...</p>;
  } else if (isError) {
    content = <p className='errmsg'>{error?.data?.message}</p>;
  } else if (isSuccess) {
    const { ids } = posts;
    content = ids?.length ? ids.map((postId) => <Post key={postId} postId={postId} />) : null;
  }

  return <div className='feed'>{content}</div>;
};

export default PostList;
