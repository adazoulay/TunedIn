import React, { useState, useEffect, memo } from "react";
import { useGetPostsQuery } from "../postsApiSlice";
import { useLazyGetUserQuery } from "../../users/usersApiSlice";
import Post from "./Post";
import Repost from "./Repost";

const PostWrapper = ({ postId: initialPostId, fetchArgs }) => {
  const [postId, setPostId] = useState(initialPostId);
  const [originalPostData, setOriginalPostData] = useState(null);

  const { post } = useGetPostsQuery(fetchArgs, {
    selectFromResult: ({ data }) => ({
      post: data?.entities[postId],
    }),
  });

  useEffect(() => {
    let getReposter = async (reposterId) => {
      await trigger(reposterId);
    };

    if (post?.isRepost) {
      setOriginalPostData(post);
      setPostId(post?.repost.originalId);
      getReposter(post.userId);
    }
  }, [initialPostId, post?.isRepost, post?.repost?.originalId]);

  const [trigger, result] = useLazyGetUserQuery();

  return (
    <>
      {result.isSuccess && (
        <div className='repost-wrapper'>
          <Repost reposterData={result?.data?.entities[result?.data?.ids[0]]} />
        </div>
      )}
      <Post postId={postId} post={originalPostData || post} repostId={initialPostId} />
    </>
  );
};

export default memo(PostWrapper);
