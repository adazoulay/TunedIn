import React from "react";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAddNewPostMutation } from "./postsApiSlice";
import TagGroup from "../tags/TagGroup";
import SearchInput from "../../components/SearchInput";
import useAuth from "../../hooks/useAuth";

const NewPost = () => {
  const titleRef = useRef();
  const errRef = useRef();
  const [addNewPost, { isLoading, isSuccess, isError, error }] = useAddNewPostMutation();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const { userId } = useAuth();

  useEffect(() => {
    titleRef.current.focus();
  }, []);

  const onTitleChanged = (e) => setTitle(e.target.value);
  const onDescChanged = (e) => setDesc(e.target.value);

  //! Tags
  const [searchResults, setSearchResults] = useState({});
  const [selectedTags, setSelectedTags] = useState({
    ids: [],
    entities: {},
  });

  const getSearchResults = (result) => {
    setSearchResults(result);
  };

  const getSelectedTags = (tagId, entity, type) => {
    if (type === "add") {
      setSelectedTags((prevState) => {
        return {
          ids: [...prevState.ids, tagId],
          entities: {
            ...prevState.entities,
            [tagId]: entity,
          },
        };
      });
    } else {
      setSelectedTags((prevState) => {
        return {
          ids: prevState.ids.filter((id) => id !== tagId),
          entities: Object.keys(prevState.entities).reduce((obj, key) => {
            if (key !== tagId) {
              obj[key] = prevState.entities[key];
            }
            return obj;
          }, {}),
        };
      });
    }
  };

  //! Submit
  const canSave = [title, desc].every(Boolean) && !isLoading;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (canSave) {
      try {
        await addNewPost({ title, desc, tags: selectedTags?.ids });
      } catch (err) {
        if (!err.status) {
          setErrMsg("No Server Response");
        } else if (err.status === 400) {
          setErrMsg("Missing Username or Password");
        } else if (err.status === 401) {
          setErrMsg("Unauthorized");
        } else {
          setErrMsg(err.data?.message);
        }
        errRef.current.focus();
      }
    }
  };

  useEffect(() => {
    if (isSuccess) {
      setTitle("");
      setDesc("");
      setSelectedTags({});
      navigate(`/user/${userId}`);
    }
  }, [isSuccess, navigate]);

  return (
    <div className='post-section'>
      <p ref={errRef} className='' aria-live='assertive'>
        {errMsg}
      </p>
      <form className='wrapper-form' onSubmit={handleSubmit}>
        <h1>New Post</h1>
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
          <label className='form-label' htmlFor='file'>
            File:
          </label>
          <input className='file-input' type='file' id='file' />
          <div className='upload-info'>Accepts audio files</div>
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
            autoComplete='off'
            required
          />
        </div>
        <div className='tag-form'>
          <div className='tag-row'>
            <SearchInput selectedFilter={"type-tag"} getSearchResults={getSearchResults} />
            {searchResults && (
              <TagGroup getSelectedTags={getSelectedTags} type='add' tags={searchResults} />
            )}
          </div>
          <div className='tag-row'>
            <div className='selected-label'>Selected Tags:</div>
            {selectedTags && (
              <TagGroup getSelectedTags={getSelectedTags} type='remove' tags={selectedTags} />
            )}
          </div>
        </div>
        <button className='submit-button'>POST</button>
      </form>
    </div>
  );
};

export default NewPost;
