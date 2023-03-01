import React from "react";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useUpdateUserMutation } from "./usersApiSlice";
import { useGetTagsByUserIdQuery } from "../tags/tagsApiSlice";
import { useSpotifyDisconnectMutation } from "../Auth/authApiSlice";
import useAuth from "../../hooks/useAuth";
import ImageCropper from "../../components/functionality/ImageCropper";
import { uploadFile } from "../../util/uploadToS3";
import SearchInput from "../../components/functionality/search/SearchInput";
import TagGroup from "../tags/TagGroup";
import SpotifyLogo from "../../assets/SpotifyLogo.png";

import { Save } from "react-feather";

const EditUser = () => {
  const [updateUser, { isSuccess, error }] = useUpdateUserMutation();
  const [disconnectSpotify] = useSpotifyDisconnectMutation();

  const inputRef = useRef();
  const errRef = useRef();
  const [errMsg, setErrMsg] = useState("");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [desc, setDesc] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [image, setImage] = useState("");
  const [selectedImage, setSelectedImage] = useState("");
  const [searchResults, setSearchResults] = useState({});
  const [selectedTags, setSelectedTags] = useState({
    ids: [],
    entities: {},
  });

  //! Input fields

  const { userId } = useAuth();
  const navigate = useNavigate();

  const onUsernameChanged = (e) => setUsername(e.target.value);
  const onPasswordChanged = (e) => setPassword(e.target.value);
  const onDescChanged = (e) => setDesc(e.target.value);

  //! Tags

  const { data: tagData, isSuccess: isSuccessTags } = useGetTagsByUserIdQuery(userId);

  useEffect(() => {
    if (isSuccessTags) {
      setSelectedTags(tagData);
    }
  }, [isSuccessTags]);

  const getSearchResults = (result) => {
    setSearchResults(result);
  };

  const getSelectedTags = (tagId, entity, type) => {
    if (type === "add") {
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

  //! Submit

  const onSaveUserClicked = async (e) => {
    e.preventDefault();
    try {
      await updateUser({ username, password, desc, imageUrl, topTags: selectedTags?.ids });
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
  };

  useEffect(() => {
    if (isSuccess) {
      setUsername("");
      setPassword("");
      setDesc("");
      navigate(`/user/${userId}`);
    }
  }, [isSuccess, navigate]);

  useEffect(() => {
    const upload = async () => {
      if (image) {
        const fileType = "image/jpeg";
        const url = await uploadFile(image, fileType);
        setImageUrl(url);
      }
    };
    if (image) {
      upload();
    }
  }, [image]);

  const handleSpotifyDisconnect = () => {
    disconnectSpotify();
  };

  //! Display file popup

  const triggerFileSelectPopup = () => inputRef.current.click();

  const onSelectFile = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.addEventListener(`load`, () => {
        setSelectedImage(reader.result);
      });
    }
  };

  return (
    <div className='form-section'>
      <p ref={errRef} className='' aria-live='assertive'>
        {errMsg}
      </p>
      <form
        className='wrapper-form edit-user-form'
        id='edit-user-form'
        onSubmit={onSaveUserClicked}>
        <h1>Edit User</h1>
        <div className='form-row'>
          <label className='form-label' htmlFor='editUsername'>
            Username: <span className='field-info'>[3-20 letters]</span>
          </label>
          <input
            className='form-input'
            id='editUsername'
            name='username'
            type='text'
            autoComplete='off'
            value={username}
            onChange={onUsernameChanged}
          />
        </div>
        <div className='form-row'>
          <label className='form-label' htmlFor='editPassword'>
            Password: <span className='field-info'>[4-12 chars]</span>
          </label>
          <input
            className='form-input'
            id='editPassword'
            name='password'
            type='password'
            value={password}
            onChange={onPasswordChanged}
          />
        </div>
        <div className='form-row'>
          <input
            type='file'
            accept='image/*'
            ref={inputRef}
            style={{ display: "none" }}
            onChange={onSelectFile}
          />
          <div className='picture-section'>
            <div className='picture-header'>
              <label className='form-label' htmlFor='img'>
                Profile Picture:
              </label>
              <button className='base-button' onClick={triggerFileSelectPopup} type='button'>
                Select Image
              </button>
            </div>
            {image && <img src={imageUrl} alt='NO IMAGE' className='user-page-profile-pic' />}
          </div>
          <ImageCropper setCroppedImage={setImage} img={selectedImage} />
        </div>
        <div className='form-row'>
          <label className='form-label' htmlFor='editDesc'>
            Description:
          </label>
          <input
            className='form-input'
            id='editDesc'
            name='desc'
            type='desc'
            value={desc}
            onChange={onDescChanged}
          />
        </div>
        <div className='form-row'>
          <label className='form-label' htmlFor='editDesc'>
            Tag spotlight:
          </label>
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
                <TagGroup
                  getSelectedTags={getSelectedTags}
                  type='remove'
                  tags={selectedTags}
                />
              )}
            </div>
          </div>
          <div className='button-row'>
            <button className='base-button' type='submit' form='edit-user-form' title='Save'>
              <Save /> Save
            </button>
            <button
              className='spotify-disconnect-button'
              type='submit'
              onClick={handleSpotifyDisconnect}>
              <img src={SpotifyLogo} alt='' className='spotify-logo' />
              <div>disconnect</div>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
export default EditUser;
