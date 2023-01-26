import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUpdateUserMutation } from "./usersApiSlice";
import useAuth from "../../hooks/useAuth";
import ImageCropper from "../../components/ImageCropper";
import { uploadFile } from "../../util/uploadToS3";

import { Save } from "react-feather";

const EditUser = () => {
  const [updateUser, { isSuccess, error }] = useUpdateUserMutation();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [desc, setDesc] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [image, setImage] = useState("");
  const [selectedImage, setSelectedImage] = useState("");

  //Display Stuff
  const inputRef = React.useRef();
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

  //! Other stuff

  const { userId } = useAuth();
  const navigate = useNavigate();

  const onUsernameChanged = (e) => setUsername(e.target.value);
  const onPasswordChanged = (e) => setPassword(e.target.value);
  const onDescChanged = (e) => setDesc(e.target.value);

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

  //! Submit
  useEffect(() => {
    if (isSuccess) {
      setUsername("");
      setPassword("");
      setDesc("");
      navigate(`/user/${userId}`);
    }
  }, [isSuccess, navigate]);

  const onSaveUserClicked = async (e) => {
    e.preventDefault();
    await updateUser({ username, password, desc, imageUrl });
  };

  const content = (
    <div className='auth-section'>
      <h1>EDIT</h1>
      <p>{error?.data?.message}</p>
      <form className='wrapper-form' id='edit-user-form' onSubmit={onSaveUserClicked}>
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
          <label className='form-label' htmlFor='img'>
            Profile Picture:
          </label>
          <input
            type='file'
            accept='image/*'
            ref={inputRef}
            style={{ display: "none" }}
            onChange={onSelectFile}
          />
          <button className='crop-button' onClick={triggerFileSelectPopup} type='button'>
            Select Image
          </button>
          <ImageCropper setCroppedImage={setImage} img={selectedImage} />
          {image && <img src={imageUrl} alt='NO IMAGE' className='user-page-profile-pic' />}
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
        <div className='button-row'>
          <button className='submit-button' type='submit' form='edit-user-form' title='Save'>
            <Save /> Save
          </button>
        </div>
      </form>
    </div>
  );

  return content;
};
export default EditUser;
