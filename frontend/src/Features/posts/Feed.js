import {
  useGetPostsQuery,
  useGetPostsByUserIdQuery,
  useGetPostsByTagIdQuery,
} from "./postsApiSlice";
import React, { useEffect, useState, useRef, memo } from "react";

import Post from "./Post";

const Feed = ({ type, source }) => {
  const [page, setPage] = useState(1);
  const [ids, setIds] = useState([]);

  const feedRef = useRef(null);

  useEffect(() => {
    console.log("mounted");
    setPage(1);
    setIds(0);
    window.scrollTo(0, 0);
    return () => console.log("unmounted");
  }, [type]); //! SET IDS AND TYPE IN STATE

  let feedData;
  if (type === "HOME" || type === "TREND" || type === "SUB") {
    // console.log("HOME");
    feedData = useGetPostsQuery({ page, type }, { refetchOnMountOrArgChange: true });
  } else if (type === "USER") {
    feedData = useGetPostsByUserIdQuery(source);
  } else if (type === "TAG") {
    feedData = useGetPostsByTagIdQuery(source);
  } else {
    return <p>Loading1...</p>;
  }

  const { data: posts, isLoading, isSuccess, isFetching, isError, error } = feedData;

  useEffect(() => {
    function handleScroll() {
      if (
        feedRef?.current?.getBoundingClientRect().bottom <= window.innerHeight &&
        isFetching
      ) {
        console.log("page", page);
        setPage((page) => page + 1);
      }
    }
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [feedRef]);

  let content;

  useEffect(() => {
    if (isLoading) {
      content = <p>Loading2...</p>;
    } else if (isError) {
      content = <p className='errmsg'>{error?.data?.message}</p>;
    } else if (isSuccess) {
      // const { ids } = posts;
      setIds(() => posts.ids);
    }
  }, [posts]);

  console.log(posts);

  return (
    <>
      <div ref={feedRef} className='feed'>
        {ids?.length ? (
          ids.map((postId) => <Post key={postId} postId={postId} postArgs={{ page, type }} />)
        ) : (
          <p>No posts here yet. Make one!</p>
        )}
      </div>
    </>
  );
};

export default memo(Feed);
