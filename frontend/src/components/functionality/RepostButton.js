import React from "react";
import { useRepostPostMutation } from "../../Features/posts/postsApiSlice";
import { RefreshCcw } from "react-feather";

const RepostButton = ({ postId }) => {
  const [repostPost] = useRepostPostMutation();

  const handleClick = () => {
    repostPost(postId);
  };

  return (
    <div onClick={handleClick}>
      <RefreshCcw size={24} />
    </div>
  );
};

export default RepostButton;
