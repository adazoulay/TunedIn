import React, { useEffect } from "react";
import Tag from "./Tag";
import { useGetTagsByPostIdQuery } from "./tagsApiSlice";

const TagGroup = ({ postId, onColorsFetched }) => {
  //! Rerending too many times. Try to fix
  //! Todo tmrw. Optional props to pass either userId or postId
  //! Maybe abstract out useGetTagsByPostIdQuery and pass tags directly instead

  console.log("Tag Group");

  const { data: tags, isLoading, isSuccess, isError, error } = useGetTagsByPostIdQuery(postId);

  let content;
  let colors = ["white", "gray"];

  useEffect(() => {
    onColorsFetched(colors);
    console.log("USE EFFECT TRIGGERED");
  }, [isSuccess]);

  if (isLoading) content = <p>Loading...</p>;

  if (isError) {
    content = <p className='errmsg'>{error?.data?.message}</p>;
  }

  if (isSuccess) {
    const { ids, entities } = tags;
    colors = ids.map((id) => entities[id].color);
    content = ids?.length
      ? ids.map((tagId) => <Tag key={tagId} tagInfo={entities[tagId]} />)
      : null;
  }

  return <div className='tag-group'>{content}</div>;
};

export default TagGroup;
