import React from "react";
import { Link } from "react-router-dom";

const Tag = ({ tagInfo, tagId }) => {
  const { color, name } = tagInfo;

  return (
    <Link to={`/tag/${tagId}`}>
      <div className='tag' style={{ background: color }}>
        {name}
      </div>
    </Link>
  );
};

export default Tag;
