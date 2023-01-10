import React, { useEffect, memo } from "react";
import Tag from "./Tag";
import { useGetTagsByPostIdQuery } from "./tagsApiSlice";

const TagGroup = ({ postId, onColorsFetched }) => {
  //! Todo tmrw. Optional props to pass either userId or postId

  const { data: tags, isLoading, isSuccess, isError, error } = useGetTagsByPostIdQuery(postId);

  let content;
  let colors;

  useEffect(() => {
    if (colors) {
      onColorsFetched(colors);
    }
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

export default memo(TagGroup, (prevProps, nextProps) => {
  return prevProps.postId === nextProps.postId;
});
