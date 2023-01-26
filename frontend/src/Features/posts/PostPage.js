import React, { useState } from "react";
import Cropper from "react-easy-crop";
const PostPage = () => {
  const inputRef = React.useRef();
  const triggerFileSelectPopup = () => inputRef.current.click();

  const [image, setImage] = useState(null);
  const [croppedArea, setCroppedArea] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const onCropComplete = (croppedAreaPercentage, croppedAreaPixels) => {
    setCroppedArea(croppedAreaPixels);
  };

  const onSelectFile = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.addEventListener(`load`, () => {
        console.log(reader);
        setImage(reader.result);
      });
    }
  };

  return (
    <div className='img-upload-container'>
      <div className='crop-container'>
        {image ? (
          <>
            <div className='cropper'>
              <Cropper
                image={image}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>
            <div className='slider'>
              <input
                type='range'
                value={zoom}
                min={1}
                max={3}
                step={0.01}
                aria-labelledby='Zoom'
                onChange={(e) => {
                  setZoom(e.target.value);
                }}
                className='zoom-range'
              />
            </div>
          </>
        ) : null}
      </div>
      <div className='crop-buttons'>
        <input
          type='file'
          accept='image/*'
          ref={inputRef}
          style={{ display: "none" }}
          onChange={onSelectFile}
        />
        <button className='crop-button' onClick={triggerFileSelectPopup}>
          Choose
        </button>
        <button className='crop-button'>Download</button>
      </div>
    </div>
  );
};

export default PostPage;
