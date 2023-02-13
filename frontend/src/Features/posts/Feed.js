import { useGetPostsQuery } from "./postsApiSlice";
import React, { useEffect, useState, useRef, memo } from "react";

import Post from "./post/Post";

const Feed = ({ type, source }) => {
  const [page, setPage] = useState(1);
  const [ids, setIds] = useState([]);

  const feedRef = useRef(null);

  useEffect(() => {
    setPage(() => 1);
    setIds(() => []);
    window.scrollTo(0, 0);
  }, [type, source]); //! SET IDS AND TYPE IN STATE

  const {
    data: posts,
    isLoading,
    isSuccess,
    isFetching,
    isError,
    error,
  } = useGetPostsQuery({ page, type, source }, { refetchOnMountOrArgChange: true });

  //! Maybe useIntersectionObserver
  useEffect(() => {
    console.log("setpage");
    function handleScroll() {
      if (feedRef?.current?.getBoundingClientRect().bottom <= window.innerHeight) {
        console.log("setpage");
        setPage((page) => page + 1);
      }
    }
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [feedRef]);

  useEffect(() => {
    if (isSuccess) {
      setIds(() => posts.ids);
    }
  }, [posts]);

  if (isLoading) {
    return <p>Loading...</p>;
  } else if (isError) {
    return <p className='errmsg'>{error?.data?.message}</p>;
  }

  return (
    <>
      <div ref={feedRef} className='feed'>
        {isSuccess && ids?.length ? (
          posts.ids.map((postId) => (
            <Post key={postId} postId={postId} fetchArgs={{ page, type, source }} />
          ))
        ) : (
          <p>No posts here yet. Make one!</p>
        )}
      </div>
    </>
  );
};

export default memo(Feed);
