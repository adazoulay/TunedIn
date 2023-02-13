import React from "react";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAddNewPostMutation } from "./postsApiSlice";
import TagGroup from "../tags/TagGroup";
import SearchInput from "../../components/functionality/search/SearchInput";
import useAuth from "../../hooks/useAuth";
import { uploadFile } from "../../util/uploadToS3";

const NewPost = ({ handleModalClose }) => {
  const titleRef = useRef();
  const errRef = useRef();
  const [errMsg, setErrMsg] = useState("");

  const [addNewPost, { isLoading, isSuccess }] = useAddNewPostMutation();
  const navigate = useNavigate();

  const [searchResults, setSearchResults] = useState({});
  const [selectedTags, setSelectedTags] = useState({
    ids: [],
    entities: {},
  });

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [file, setFile] = useState();
  const [content, setContent] = useState("");

  const { userId } = useAuth();

  useEffect(() => {
    titleRef.current.focus();
  }, []);

  const onTitleChanged = (e) => setTitle(e.target.value);
  const onDescChanged = (e) => setDesc(e.target.value);

  //! File
  const inputRef = useRef();
  const triggerFileSelectPopup = () => inputRef.current.click();

  const upload = async () => {
    if (content) {
      const url = await uploadFile(content, content.type);
      return url;
    }
  };

  const onSelectFile = (event) => {
    setFile(event.target.files[0]);
    if (event.target.files && event.target.files.length > 0) {
      const reader = new FileReader();
      reader.onload = function () {
        setContent(new Blob([reader.result], { type: event.target.files[0].type }));
      };

      reader.readAsArrayBuffer(event.target.files[0]);
    }
  };

  //! Submit
  const canSave = [title, desc].every(Boolean) && !isLoading;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (canSave) {
      try {
        const contentUrl = await upload();
        handleModalClose();
        await addNewPost({
          title,
          desc,
          tags: selectedTags?.ids,
          contentUrl,
          contentType: content?.type,
          fileName: file?.name,
        });
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

  //! TAGS SEARCH

  const getSearchResults = (result) => {
    setSearchResults(result);
  };

  const getSelectedTags = (tagId, entity, type) => {
    if (type === "add") {
      if (selectedTags.ids.length >= 5) {
        return;
      }
      if (!selectedTags.ids.includes(tagId)) {
        setSelectedTags((prevState) => {
          return {
            ids: [...prevState.ids, tagId],
            entities: {
              ...prevState.entities,
              [tagId]: entity,
            },
          };
        });
      }
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

  return (
    <div className='form-section'>
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
          <input
            className='file-input'
            type='file'
            accept='audio/*, video/*'
            id='file'
            ref={inputRef}
            style={{ display: "none" }}
            onChange={onSelectFile}
          />
          <button className='base-button' onClick={triggerFileSelectPopup} type='button'>
            Upload File
          </button>
          <div className='grayed'> {file && file?.name}</div>
          <div className='field-info'>
            Accepts .FLAC, .WAV, .AIFF, .MOV, .MP4 (and MP3 👎 ){" "}
          </div>
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
          <div className='tag-col'>
            <SearchInput selectedFilter={"type-tag"} getSearchResults={getSearchResults} />
            {searchResults && (
              <TagGroup getSelectedTags={getSelectedTags} type='add' tags={searchResults} />
            )}
          </div>
          <div className='tag-col'>
            <div
              className='selected-label'
              style={{ height: "35px", display: "flex", alignItems: "center" }}>
              Selected Tags:
            </div>
            {selectedTags && (
              <TagGroup getSelectedTags={getSelectedTags} type='remove' tags={selectedTags} />
            )}
          </div>
        </div>
        <div className='field-info'>
          Tags max 5. If you feel like you need more consider creating a new tag!
        </div>
        <button className='main-button' disabled={!canSave}>
          Post
        </button>
      </form>
    </div>
  );
};

export default NewPost;
