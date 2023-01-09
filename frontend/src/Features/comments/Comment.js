import React from "react";

const Comment = ({ commentInfo }) => {
  const { desc } = commentInfo;

  return (
    <div>
      <b>User : </b>
      {desc}
    </div>
  );
};

export default Comment;
