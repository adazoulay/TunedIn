import React, { memo } from "react";
import Tag from "./Tag";

const TagGroup = ({ tags, containerType }) => {
  if (tags) {
    const { ids, entities } = tags;

    const renders = React.useRef(0);
    return (
      <div className='tag-group'>
        <div>TagGroup Renders: {renders.current++}</div>
        {ids?.length
          ? ids.map((tagId) => <Tag key={tagId} tagInfo={entities[tagId]} tagId={tagId} />)
          : null}
      </div>
    );
  }
};

export default memo(TagGroup);
