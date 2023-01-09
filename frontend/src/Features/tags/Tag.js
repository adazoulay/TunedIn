import React from "react";

const Tag = ({ tagInfo }) => {
  const { color, name, id } = tagInfo;

  return (
    <div className='tag' style={{ background: color }}>
      {name}
    </div>
  );
};

export default Tag;
