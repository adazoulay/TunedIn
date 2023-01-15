import { useGetPostsQuery } from "./postsApiSlice";
import { useGetPostsByUserIdQuery } from "./postsApiSlice";
import { useGetPostsByTagIdQuery } from "./postsApiSlice";
import React from "react";

import Post from "./Post";

const Feed = ({ type, source }) => {
  let feedData;

  if (type === "HOME") {
    feedData = useGetPostsQuery();
  } else if (type === "USER") {
    feedData = useGetPostsByUserIdQuery(source);
  } else if (type === "TAG") {
    feedData = useGetPostsByTagIdQuery(source);
  }

  const { data: posts, isLoading, isSuccess, isError, error } = feedData;

  let content;

  if (isLoading) {
    content = <p>Loading...</p>;
  } else if (isError) {
    content = <p className='errmsg'>{error?.data?.message}</p>;
  } else if (isSuccess) {
    const { ids } = posts;
    content = ids?.length ? ids.map((postId) => <Post key={postId} postId={postId} />) : null;
  }

  return <div className='feed'>{content}</div>;
};

// export default React.memo(Feed, (prevProps, nextProps) => {
//   return prevProps.source === nextProps.source && prevProps.type === prevProps.type;
// });
export default Feed;
