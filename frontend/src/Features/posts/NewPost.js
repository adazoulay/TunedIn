import React from "react";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAddNewPostMutation } from "./postsApiSlice";
import useAuth from "../../hooks/useAuth";

const NewPost = () => {
  const titleRef = useRef();
  const [addNewPost, { isLoading, isSuccess, isError, error }] = useAddNewPostMutation();

  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const { userId } = useAuth();

  useEffect(() => {
    titleRef.current.focus();
  }, []);

  useEffect(() => {
    if (isSuccess) {
      setTitle("");
      setDesc("");
      navigate(`/user/${userId}`);
    }
  }, [isSuccess, navigate]);

  const onTitleChanged = (e) => setTitle(e.target.value);
  const onDescChanged = (e) => setDesc(e.target.value);

  const canSave = [title, desc].every(Boolean) && !isLoading;

  const onSavePostClicked = async (e) => {
    e.preventDefault();
    if (canSave) {
      await addNewPost({ title, desc });
    }
  };

  return (
    <div className='content-page'>
      <form className='wrapper-form' onSubmit={onSavePostClicked}>
        <div className='form-row'>
          <label className='form-label' htmlFor='title'>
            Title:
          </label>
          <input
            className='form-input'
            type='text'
            id='title'
            value={title}
            onChange={onTitleChanged}
            ref={titleRef}
            autoComplete='off'
            required
          />
        </div>
        <div className='form-row'>
          <label className='form-label' htmlFor='desc'>
            Description:
          </label>
          <input
            className='form-input'
            type='text'
            id='desc'
            value={desc}
            onChange={onDescChanged}
            required
          />
        </div>
        <button className='login-button'>POST</button>
      </form>
    </div>
  );
};

export default NewPost;
