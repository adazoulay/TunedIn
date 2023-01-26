import {
  useGetPostsQuery,
  useGetTrendQuery,
  useGetSubQuery,
  useGetPostsByUserIdQuery,
  useGetPostsByTagIdQuery,
} from "./postsApiSlice";
import React, { useEffect, useState, useRef } from "react";

import Post from "./Post";

const Feed = ({ type, source }) => {
  const [page, setPage] = useState(1);

  const feedRef = useRef(null);

  let feedData;
  if (type === "HOME") {
    feedData = useGetPostsQuery(page, { refetchOnMountOrArgChange: true });
  } else if (type === "TREND") {
    feedData = useGetTrendQuery(page, { refetchOnMountOrArgChange: true });
  } else if (type === "SUB") {
    feedData = useGetSubQuery({ refetchOnMountOrArgChange: true });
  } else if (type === "USER") {
    feedData = useGetPostsByUserIdQuery(source);
  } else if (type === "TAG") {
    feedData = useGetPostsByTagIdQuery(source);
  } else {
    return <p>Loading1...</p>;
  }

  const { data: posts, isLoading, isSuccess, isError, error } = feedData;

  console.log(page);
  useEffect(() => {
    function handleScroll() {
      if (
        feedRef?.current?.getBoundingClientRect().bottom <= window.innerHeight
        // &&(isLoading || isFetching)
      ) {
        console.log("Reached bottom of feed!");
        setPage((page) => page + 1);
      }
    }
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [feedRef]);

  let content;
  if (isLoading) {
    content = <p>Loading2...</p>;
  } else if (isError) {
    content = <p className='errmsg'>{error?.data?.message}</p>;
  } else if (isSuccess) {
    const { ids } = posts;
    content = ids?.length ? (
      ids.map((postId) => <Post key={postId} postId={postId} />)
    ) : (
      <p>No posts here yet. Make one!</p>
    );
  }

  return (
    <>
      <div ref={feedRef} className='feed'>
        {content}
      </div>
    </>
  );
};

export default Feed;
