import React from "react";

const Comment = ({ commentInfo }) => {
  const { username, desc } = commentInfo;

  return (
    <div>
      <b>{username} : </b>
      {desc}
    </div>
  );
};

export default Comment;
