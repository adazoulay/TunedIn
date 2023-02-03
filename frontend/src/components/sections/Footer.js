import React, { useState, useEffect } from "react";
import AudioPlayer from "../functionality/audio/AudioPlayer";
import { Link } from "react-router-dom";
import { selectPlayerInfo } from "../functionality/audio/playerReducer";
import { useSelector } from "react-redux";
import { useSpring, animated } from "@react-spring/web";
import { ChevronsLeft } from "react-feather";
import useMeasure from "react-use-measure";
import { useDispatch } from "react-redux";
import { clearPlayerInfo } from "../functionality/audio/playerReducer";

const Footer = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [ref, bounds] = useMeasure();

  const panelContentAnimatedStyle = useSpring({
    transform: isCollapsed ? "scale(0, 1)" : "scale(1, 1)",
  });

  const handleClosePlayer = () => {
    setIsCollapsed(true);
    setTimeout(() => dispatch(clearPlayerInfo()), 500);
  };

  const playerInfo = useSelector(selectPlayerInfo);
  const dispatch = useDispatch();

  useEffect(() => {
    if (playerInfo?.audioUrl) {
      setIsCollapsed(false);
    }
  }, [playerInfo?.audioUrl]);

  const userContent = playerInfo?.userImg ? (
    <div className='post-user'>
      <img src={playerInfo.userImg} alt='profile-picture' className='pic-small' />
    </div>
  ) : (
    <h3 className='post-username'>{playerInfo?.username}</h3>
  );

  return (
    <div className='footer' ref={ref}>
      {playerInfo?.audioUrl && (
        <animated.div className='footer-content' style={panelContentAnimatedStyle}>
          <div className='footer-player'>
            {playerInfo?.audioUrl && <AudioPlayer audio={playerInfo.audioUrl} />}
          </div>
          <div className='footer-info'>
            <Link to={`/user/${playerInfo?.userId}`}>{userContent}</Link>
            {/* <Link to={`/post/${playerInfo?.postId}`}> */}
            <h2 className='post-username'>{playerInfo?.title}</h2>
            {/* </Link> */}
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
