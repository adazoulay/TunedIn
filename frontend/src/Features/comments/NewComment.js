import React, { useEffect, useState } from "react";
import { useAddNewCommentMutation } from "./commentsApiSlice";
import { Send } from "react-feather";
import useAuth from "../../hooks/useAuth";

const NewComment = ({ postId }) => {
  const [desc, setDesc] = useState("");
  const [addNewComment, { isSuccess }] = useAddNewCommentMutation();
  const { userId, username } = useAuth();

  const handleDescChange = (e) => {
    setDesc(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (!e.shiftKey && e.key === "Enter") {
      handleSubmit(e);
    } else if (e.shiftKey && e.key === "Enter") {
      setDesc((prevDesc) => prevDesc + "\n");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (desc && username) {
      const commentData = {
        userId,
        username,
        desc,
      };
      addNewComment({ id: postId, commentData });
    }
  };

  useEffect(() => {
    if (isSuccess) {
      setDesc("");
    }
  }, [isSuccess]);

  return (
    <div className='new-comment-wrapper'>
      <form className='comment-form' onSubmit={handleSubmit}>
        <textarea
          className='new-comment-input'
          value={desc}
          onChange={handleDescChange}
          onKeyDown={handleKeyDown}
          placeholder='Comment...'
        />
        <button className='send-comment'>
          <Send color='white' />
        </button>
      </form>
    </div>
  );
};

export default NewComment;
