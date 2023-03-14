import Comment from "./Comment";
import React, { memo } from "react";
import TimeAgo from "../../components/functionality/TimeAgo";

const BroadCastList = ({ comments }) => {
  const { ids, entities } = comments;

  console.log(entities[ids[0]]);

  return (
    <div className='broadcast-list'>
      {ids?.length
        ? ids.map((commentId) => (
            <div className='broadcast-post' key={commentId}>
              <div className='info grayed'>
                <TimeAgo timestamp={entities[commentId].createdAt} />
              </div>
              <Comment commentInfo={entities[commentId]} />
            </div>
          ))
        : null}
    </div>
  );
};

export default memo(BroadCastList);
