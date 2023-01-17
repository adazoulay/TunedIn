import React from "react";
import Feed from "../posts/Feed";
import TagGroup from "../tags/TagGroup";
import { useParams } from "react-router-dom";
import { useGetTagQuery } from "./tagsApiSlice";
import Tag from "./Tag";

const TagPage = () => {
  let { id: tagId } = useParams();

  let tag;
  const { data: tagData, isSuccess: isSuccessTag } = useGetTagQuery(tagId);
  if (isSuccessTag) {
    tag = tagData.entities[tagData.ids[0]];
  }

  return (
    <>
      <div className='content-header'>
        <div className='tag-info'>
          {isSuccessTag && <Tag tagInfo={tag} tagId={tagId} size='large' />}
          <div className='tag-relation'>
            <h3>Parents:</h3>
            <h3>Children:</h3>
          </div>
          <button className='follow-button'>Follow</button>
        </div>
      </div>
      <Feed type={"TAG"} source={tagId} />
    </>
  );
};

export default TagPage;
