import React, { useState, useCallback, useEffect } from "react";
import getCroppedImg from "../util/cropImage";
import Cropper from "react-easy-crop";

const ImageCropper = ({ setCroppedImage, img }) => {
  const inputRef = React.useRef();
  const triggerFileSelectPopup = () => inputRef.current.click();

  const [image, setImage] = useState(null);
  const [croppedArea, setCroppedArea] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const [display, setDisplay] = useState(false);

  const onCropComplete = (croppedAreaPercentage, croppedAreaPixels) => {
    setCroppedArea(croppedAreaPixels);
  };

  const onSelectFile = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.addEventListener(`load`, () => {
        setImage(reader.result);
      });
      setDisplay(true);
    }
  };

  useEffect(() => {
    if (img) {
      if (img !== image) {
        setImage(img);
        setDisplay(true);
      }
    }
  }, [img]);

  //! Submit
  const getCroppedImage = async () => {
    try {
      const croppedImage = await getCroppedImg(image, croppedArea);
      console.log("donee", { croppedImage });
      setCroppedImage(croppedImage);
      setDisplay(false);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className='img-upload-container' style={{ display: display ? "block" : "none" }}>
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
        <button className='crop-button' onClick={triggerFileSelectPopup} type='button'>
          Select Image
        </button>
        <button
          className='crop-button'
          type='button'
          onClick={getCroppedImage}
          style={{ display: display ? "block" : "none" }}>
          Crop
        </button>
      </div>
    </div>
  );
};

export default ImageCropper;
