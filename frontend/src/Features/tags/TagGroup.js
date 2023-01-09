import React from "react";
import Tag from "./Tag";
const TagGroup = () => {
  const tagInfo1 = {
    name: "Rock",
    color: "red",
    id: "123943189",
  };
  const tagInfo2 = {
    name: "Funk",
    color: "purple",
    id: "123943189",
  };
  const tagInfo3 = {
    name: "Raggae",
    color: "orange",
    id: "123943189",
  };
  return (
    <div className='tag-group'>
      <Tag tagInfo={tagInfo1} />
      <Tag tagInfo={tagInfo2} />
      <Tag tagInfo={tagInfo3} />
    </div>
  );
};

export default TagGroup;
