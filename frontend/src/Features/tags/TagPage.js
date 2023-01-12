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

  console.log(tag);
  return (
    <div className='content-page'>
      <div className='content-header'>
        <div className='tag-info'>
          {isSuccessTag && <Tag tagInfo={tag} tagId={tagId} size='large' />}
          <div className='tag-relation'>
            <h3>Parents:</h3>
            <h3>Children:</h3>
          </div>
          <button className='follow-btn'>Follow</button>
        </div>
      </div>
      <div className='content-body'>
        <Feed type={"TAG"} source={tagId} />
      </div>
    </div>
  );
};

export default TagPage;
