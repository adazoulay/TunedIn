import React from "react";
import TagGroup from "./TagGroup";
import { useGetTrendingTagsQuery } from "./tagsApiSlice";

const SideBarTags = () => {
  const { data: tagData, isSuccess: isSuccessTag } = useGetTrendingTagsQuery();
  return isSuccessTag && <TagGroup tags={tagData} type='sidebar-group' />;
};

export default SideBarTags;
