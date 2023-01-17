import React, { useEffect, useState } from "react";
import { useAddNewCommentMutation } from "./commentsApiSlice";
import { Send } from "react-feather";
import useAuth from "../../hooks/useAuth";

const NewComment = ({ postId }) => {
  const [desc, setDesc] = useState("");
  const [addNewComment, { isLoading, isSuccess, isError, error }] = useAddNewCommentMutation();
  const { userId, username } = useAuth();

  const handleDescChange = (e) => {
    setDesc(e.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (desc) {
      console.log(postId);
      await addNewComment({ id: postId, userId, username, desc });
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
        <input
          className='new-comment-input'
          type='text'
          value={desc}
          onChange={handleDescChange}
        />
        <button className='send-comment'>
          <Send color='white' />
          {/*  */}
        </button>
      </form>
    </div>
  );
};

export default NewComment;
