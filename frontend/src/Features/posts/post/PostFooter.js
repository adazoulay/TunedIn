import React, { memo } from "react";
import TimeAgo from "../../../components/functionality/audio/TimeAgo";
import CommentSection from "../../comments/CommentSection";
import SavePostButton from "./buttons/SavePostButton";
import LikePostButton from "./buttons/LikePostButton";
import CopyLinkButton from "../../../components/functionality/CopyLinkButton";

const PostFooter = ({ postFooterData }) => {
  const { postId, desc, createdAt, likes, views } = postFooterData;

  if (!postId || !postFooterData) {
    return <p>Loading...</p>;
  }

  return (
    <>
      {/* <hr className='divider' /> */}
      <div className='description'>
        <p>{desc && desc}</p>
      </div>
      <hr className='divider' />
      <div className='interact'>
        <div className='comment-section'>
          <CommentSection postId={postId} />
        </div>
        <div className='lower-right'>
          <div className='post-link'>
            <CopyLinkButton type={"post"} id={postId} />
          </div>

          <div className='bookmark'>
            <SavePostButton postId={postId} />
          </div>
          <div className='likes'>
            <LikePostButton postId={postId} likes={likes} />
          </div>
        </div>
        <div className='footer-stats'>
          {views > 0 && <div className='views'>{views} views</div>}
          <TimeAgo timestamp={createdAt} />
        </div>
      </div>
    </>
  );
};

export default memo(PostFooter);
