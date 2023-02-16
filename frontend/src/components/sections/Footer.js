import React, { useState, useEffect, useRef } from "react";
import MediaPlayer from "../functionality/audio/MediaPlayer";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { selectPlayerInfo, clearPlayerInfo } from "../functionality/audio/playerReducer";
import { ChevronsLeft } from "react-feather";
import { useSpring, useChain, animated } from "@react-spring/web";

const Footer = () => {
  const playerInfo = useSelector(selectPlayerInfo);
  const dispatch = useDispatch();
  const mediaRef = useRef();
  const [isCollapsed, setIsCollapsed] = useState(true);

  const panelContentAnimatedStyle = useSpring({
    // zIndex: isCollapsed ? 3 : 9,
    transform: isCollapsed ? `translate3d(-100%,0,0)` : `translate3d(0%,0,0)`,
  });

  const handleClosePlayer = () => {
    setIsCollapsed(true);
    setTimeout(() => dispatch(clearPlayerInfo()), 500);
  };

  useEffect(() => {
    if (playerInfo?.contentUrl) {
      setIsCollapsed(false);
    }
  }, [playerInfo?.contentUrl]);

  const userContent = playerInfo?.userImg ? (
    <div className='post-user'>
      <img src={playerInfo.userImg} alt='profile-picture' className='pic-small' />
    </div>
  ) : (
    <h3 className='post-username'>{playerInfo?.username}</h3>
  );

  return (
    <div className='footer' style={{ zIndex: isCollapsed ? 0 : 9 }}>
      {playerInfo?.contentUrl && (
        <animated.div className='footer-content' style={panelContentAnimatedStyle}>
          <div className='footer-player'>
            {playerInfo?.contentUrl && (
              <MediaPlayer mediaRef={mediaRef}>
                <audio
                  ref={mediaRef}
                  src={playerInfo.contentUrl}
                  crossOrigin='anonymous'
                  controls={false}
                  id={playerInfo.postId}
                  // onError={(e) => console.log(e)}
                  preload='metadata'
                />
              </MediaPlayer>
            )}
          </div>
          <div className='footer-info'>
            <Link to={`/user/${playerInfo?.userId}`}>{userContent}</Link>
            <Link to={`/post/${playerInfo?.postId}`}>
              <h4 className='post-username'>{playerInfo?.title}</h4>
            </Link>
          </div>
          <div onClick={handleClosePlayer} className={"close-footer"}>
            <ChevronsLeft />
          </div>
        </animated.div>
      )}
    </div>
  );
};

export default Footer;
