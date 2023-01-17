import Comment from "./Comment";
import { useGetCommentsByPostIdQuery } from "./commentsApiSlice";
import React, { memo } from "react";

const CommentSection = ({ postId }) => {
  const {
    data: comments,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetCommentsByPostIdQuery(postId);

  let content;

  if (isLoading) content = <p>Loading...</p>;

  if (isError) {
    content = <p className='errmsg'>{error?.data?.message}</p>;
  }

  if (isSuccess) {
    const { ids, entities } = comments;

    content = ids?.length
      ? ids.map((commentId) => (
          <Comment key={commentId} commendId={commentId} commentInfo={entities[commentId]} />
        ))
      : null;
  }

  return <div className='comment-section'>{content}</div>;
};

export default CommentSection;
// memo(CommentSection); //! Might be problematic when user adds comments or likes comments. Will it rerender?
