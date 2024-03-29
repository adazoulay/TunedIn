import { useGetPostsQuery } from "./postsApiSlice";
import React, { useEffect, useState, useRef, memo, CSSProperties } from "react";
import ClipLoader from "react-spinners/ClipLoader";

import PostWrapper from "./post/PostWrapper";

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

  let noContent = null;

  switch (type) {
    case "SAVED":
      noContent = "You can see your saved posts here!";
      break;
    case "SUB":
      noContent = "Follow users or tags to see activity!";
      break;
    default:
      noContent = "Make one!";
      break;
  }

  //! Maybe useIntersectionObserver
  useEffect(() => {
    // console.log("setpage");
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
    noContent = null;
    return <p>Loading...</p>;
  } else if (isError) {
    return <p className='errmsg'>{error?.data?.message}</p>;
  }

  const override = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
  };

  return (
    <>
      <div ref={feedRef} className='feed'>
        {isSuccess && ids?.length
          ? posts.ids.map((postId) => (
              <PostWrapper key={postId} postId={postId} fetchArgs={{ page, type, source }} />
            ))
          : !isFetching && (
              <div className='body-message'>
                <p>No posts here yet.</p>
                <p>{noContent}</p>
              </div>
            )}
      </div>
      <ClipLoader
        color={"red"}
        loading={isLoading}
        cssOverride={override}
        size={150}
        aria-label='Loading Spinner'
        data-testid='loader'
      />
    </>
  );
};

export default memo(Feed);
