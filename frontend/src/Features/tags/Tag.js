import React from "react";
import { Link } from "react-router-dom";

const Tag = ({ tagInfo }) => {
  const { color, name, id } = tagInfo;

  return (
    <Link to={`/tag/${id}`}>
      <div className='tag' style={{ background: color }}>
        {name}
      </div>
    </Link>
  );
};

export default Tag;
