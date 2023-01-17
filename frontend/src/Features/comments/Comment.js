import React from "react";
import { Link } from "react-router-dom";

const Comment = ({ commentInfo, commentId }) => {
  const { username, desc, userId } = commentInfo;

  return (
    <div>
      <Link to={`/user/${userId}`} className='comment-username'>
        {username}:{" "}
      </Link>
      {desc}
    </div>
  );
};

export default Comment;
