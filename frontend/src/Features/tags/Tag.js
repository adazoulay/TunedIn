import React from "react";
import { Link } from "react-router-dom";

const Tag = ({ tagInfo, tagId, size }) => {
  const { color, name } = tagInfo;

  return (
    <Link to={`/tag/${tagId}`}>
      <div className={size ? "tag-large" : "tag"} style={{ background: color }}>
        {name}
      </div>
    </Link>
  );
};

export default Tag;
