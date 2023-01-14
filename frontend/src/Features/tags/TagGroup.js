import React, { memo } from "react";
import Tag from "./Tag";

const TagGroup = ({ tags, containerType }) => {
  if (tags) {
    const { ids, entities } = tags;

    return (
      <div className='tag-group'>
        {ids?.length
          ? ids.map((tagId) => <Tag key={tagId} tagInfo={entities[tagId]} tagId={tagId} />)
          : null}
      </div>
    );
  }
};

export default memo(TagGroup);
