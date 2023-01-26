import React from "react";
import { Link } from "react-router-dom";
import { X } from "react-feather";

const Tag = ({ tagInfo, tagId, size, type }) => {
  const { color, name } = tagInfo;

  if (type === "add" || type === "remove") {
    return (
      <div className={"tag"} style={{ background: color }}>
        {name}
        {type === "remove" && (
          <div className='x'>
            <X size={10} />
          </div>
        )}
      </div>
    );
  } else {
    return (
      <Link to={`/tag/${tagId}`}>
        <div className={size ? "tag-large" : "tag"} style={{ background: color }}>
          {name}
        </div>
      </Link>
    );
  }
};

export default Tag;
