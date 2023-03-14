import React from "react";
import NewComment from "./NewComment";
import BroadcastList from "./BroadcastList";
import { useGetCommentsByPostIdQuery } from "./commentsApiSlice";

const BroadcastPage = () => {
  const POST_ID = "640198cc5f006b76875e5b3b";

  const { data: comments, isLoading } = useGetCommentsByPostIdQuery(POST_ID);

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className='broadcast'>
      <div className='broadcast-comments'>
        <BroadcastList comments={comments} />
      </div>
      <div className='broadcast-new-post'>
        <NewComment postId={POST_ID} />
      </div>
    </div>
  );
};

export default BroadcastPage;
