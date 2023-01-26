import React, { memo } from "react";
import Tag from "./Tag";

const TagGroup = ({ tags, type, getSelectedTags }) => {
  if (tags) {
    const { ids, entities } = tags;
    if (type === "add" || type === "remove") {
      return (
        <div className='tag-selection'>
          {ids?.length
            ? ids.map((tagId) => (
                <div onClick={() => getSelectedTags(tagId, entities[tagId], type)} key={tagId}>
                  <Tag tagInfo={entities[tagId]} tagId={tagId} type={type} />
                </div>
              ))
            : null}
        </div>
      );
    } else {
      if (!ids.length) {
        return;
      }
      return (
        <div className={`${type}`}>
          {ids?.length
            ? ids.map((tagId) => (
                <Tag key={tagId} tagInfo={entities[tagId]} tagId={tagId} type={type} />
              ))
            : null}
        </div>
      );
    }
  } else {
    return <p>Loading...</p>;
  }
};

export default memo(TagGroup);
