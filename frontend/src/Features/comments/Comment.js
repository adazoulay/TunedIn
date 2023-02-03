import React from "react";
import { Link } from "react-router-dom";

const Comment = ({ commentInfo }) => {
  const { username, desc, userId } = commentInfo;

  return (
    <div className='comment'>
      <Link to={`/user/${userId}`} className='comment-username'>
        {username}:{" "}
      </Link>
      {desc}
    </div>
  );
};

export default Comment;
