import React, { useEffect, useState } from "react";
import { useAddNewCommentMutation } from "./commentsApiSlice";

const NewComment = ({ postId }) => {
  const [desc, setDesc] = useState("");
  const [addNewComment, { isLoading, isSuccess, isError, error }] = useAddNewCommentMutation();

  const handleDescChange = (e) => {
    setDesc(e.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (desc) {
      console.log(postId);
      addNewComment({ id: postId, desc });
    }
    console.log(event.target.value);
  };

  useEffect(() => {
    if (isSuccess) {
      setDesc("");
    }
  }, [isSuccess]);

  return (
    <div className='new-comment'>
      <form className='comment-form' onSubmit={handleSubmit}>
        <input
          className='new-comment-input'
          type='text'
          value={desc}
          onChange={handleDescChange}
        />
      </form>
    </div>
  );
};

export default NewComment;
