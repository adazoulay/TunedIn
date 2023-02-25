import React, { useEffect, useState } from "react";
import { Link } from "react-feather";
import { useSpring, animated } from "@react-spring/web";

const CopyLinkButton = ({ type, id }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  useEffect(() => {
    if (!isCollapsed) {
      setTimeout(() => {
        setIsCollapsed(true);
      }, 450);
    }
  }, [isCollapsed]);

  const copyLink = () => {
    setIsCollapsed(false);
    const link = `https://melonet.xyz/${type}/${id}`;
    navigator.clipboard.writeText(link);
  };

  const popupFadeInAnimatedStyle = useSpring({
    opacity: !isCollapsed ? 1 : 0,
    backdropFilter: `blur(${!isCollapsed ? 3 : 0}px)`,
  });

  return (
    <div className='link-wrapper'>
      <animated.div className='copy-message' style={popupFadeInAnimatedStyle}>
        Copied
      </animated.div>
      <div className='link' onClick={copyLink}>
        <Link size={24} />
      </div>
    </div>
  );
};

export default CopyLinkButton;
