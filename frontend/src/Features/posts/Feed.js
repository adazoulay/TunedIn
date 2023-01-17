import {
  useGetPostsQuery,
  useGetTrendQuery,
  useGetSubQuery,
  useGetPostsByUserIdQuery,
  useGetPostsByTagIdQuery,
} from "./postsApiSlice";
import React, { useEffect, useState } from "react";

import Post from "./Post";

const Feed = ({ type, source }) => {
  // const [feedType, setFeedType] = useState("");

  // useEffect(() => {
  //   setFeedType(type);
  // }, [type, source]);

  let feedData;
  if (type === "HOME") {
    console.log("Getting Home");
    feedData = useGetPostsQuery();
  } else if (type === "TREND") {
    console.log("Getting Trend");
    feedData = useGetTrendQuery();
  } else if (type === "SUB") {
    console.log("Getting Sub");
    feedData = useGetSubQuery();
  } else if (type === "USER") {
    feedData = useGetPostsByUserIdQuery(source);
  } else if (type === "TAG") {
    feedData = useGetPostsByTagIdQuery(source);
  } else {
    return <p>Loading1...</p>;
  }

  const { data: posts, isLoading, isSuccess, isError, error } = feedData;

  let content;

  if (isLoading) {
    content = <p>Loading2...</p>;
  } else if (isError) {
    content = <p className='errmsg'>{error?.data?.message}</p>;
  } else if (isSuccess) {
    const { ids } = posts;
    content = ids?.length ? ids.map((postId) => <Post key={postId} postId={postId} />) : null;
  }

  return <div className='feed'>{content}</div>;
};

export default Feed;
