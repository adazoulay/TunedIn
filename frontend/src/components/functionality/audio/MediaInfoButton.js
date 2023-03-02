import React, { useState, useRef, useEffect } from "react";
import MediaInfo from "./MediaInfo";
import { useSpring, animated } from "@react-spring/web";
import { Settings } from "react-feather";

const MediaInfoButton = ({ fileName, metadata, contentType }) => {
  const mediaInfoRef = useRef();
  const [isCollapsed, setIsCollapsed] = useState(true);

  const modalFadeInAnimatedStyle = useSpring({
    opacity: !isCollapsed ? 1 : 0,
    backdropFilter: `blur(${!isCollapsed ? 3 : 0}px)`,
  });

  const handleClickOutside = (event) => {
    if (mediaInfoRef.current && !mediaInfoRef.current.contains(event.target)) {
      setIsCollapsed(() => true);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  const handleModalOpen = () => {
    setIsCollapsed(false);
  };

  if (!fileName) return;

  return (
    <div className='media-info-section' ref={mediaInfoRef}>
      <p className='grayed file'>{fileName}</p>
      <>
        <div className='modal-section'>
          <animated.div className='media-info-modal' style={modalFadeInAnimatedStyle}>
            {!isCollapsed && <MediaInfo metadata={metadata} contentType={contentType} />}
          </animated.div>
          <div className='media-info-button' onClick={handleModalOpen}>
            <Settings size={18} color={"#ebebeb"} />
          </div>
        </div>
      </>
    </div>
  );
};

export default MediaInfoButton;
