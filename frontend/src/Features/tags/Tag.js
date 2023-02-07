import React, { useState } from "react";
import { Link } from "react-router-dom";
import { X } from "react-feather";

const Tag = ({ tagInfo, tagId, size, type }) => {
  const { color, name } = tagInfo;

  const [isHover, setIsHover] = useState(false);

  const smallBoxSize = {
    backgroundColor: `${color}`,
    boxShadow: isHover && `0 0 10px 0px ${color}`,
  };

  const largeBoxSize = {
    backgroundColor: `${color}`,
    boxShadow: isHover && `0 0 15px 0 ${color}`,
  };

  const handleMouseEnter = () => {
    setIsHover(true);
  };
  const handleMouseLeave = () => {
    setIsHover(false);
  };

  if (type === "add" || type === "remove") {
    return (
      <div className={"tag"} style={smallBoxSize}>
        {name}
        {type === "remove" && (
          <div className='x'>
            <X size={11} strokeWidth='4' color='#cecece' />
          </div>
        )}
      </div>
    );
  } else {
    return (
      <Link to={`/tag/${tagId}`}>
        <div
          className={size ? "tag-large" : "tag"}
          style={size ? largeBoxSize : smallBoxSize}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}>
          {name}
        </div>
      </Link>
    );
  }
};

export default Tag;
