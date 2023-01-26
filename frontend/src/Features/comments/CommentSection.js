import React from "react";
import CommentList from "./CommentList";
import NewComment from "./NewComment";
import { useGetCommentsByPostIdQuery } from "./commentsApiSlice";

const CommentSection = ({ postId }) => {
  const { data: comments, isLoading } = useGetCommentsByPostIdQuery(postId);

  if (isLoading) return <p>Loading...</p>;

  return (
    <>
      <NewComment postId={postId} />
      <CommentList comments={comments} />
    </>
  );
};

export default CommentSection;
