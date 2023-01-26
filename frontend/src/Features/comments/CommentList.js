import Comment from "./Comment";
import React, { memo } from "react";

const CommentList = ({ comments }) => {
  const { ids, entities } = comments;

  return (
    <div className='comment-list'>
      {ids?.length
        ? ids.map((commentId) => <Comment key={commentId} commentInfo={entities[commentId]} />)
        : null}
    </div>
  );
};

export default CommentList;
// memo(CommentSection); //! Might be problematic when user adds comments or likes comments. Will it rerender?
