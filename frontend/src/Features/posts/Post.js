import TimeAgo from "./TimeAgo";
import { Link } from "react-router-dom";

import AnimatedBorder from "./AnimatedBorder";
import Soundbar from "./Soundbar";
import TagGroup from "../tags/TagGroup";
import CommentSection from "../comments/CommentSection";
import React, { useEffect, useState } from "react";
import { useGetTagsByPostIdQuery } from "../tags/tagsApiSlice";
import { useGetPostQuery } from "./postsApiSlice";
import { useGetUserQuery } from "../users/usersApiSlice";

// ! TODO import ReactionButtons from "./ReactionButtons";
// ! TODO import PostAuthor from "./PostAuthor";
// ! TODO Body content soundbar

//TODO Can react with emotes during song. Plays to other users like insta live emotes

const Post = ({ postId }) => {
  //! Post
  const { data: postData, isSuccess: isSuccessPost } = useGetPostQuery(postId);

  let post;
  if (isSuccessPost) {
    let { ids, entities } = postData;
    post = entities[ids[0]];
  }

  //! User
  const [userId, setUserId] = useState("");
  const [skip, setSkip] = useState(true);

  const { data: userData, isSuccess: isSuccessUser } = useGetUserQuery(userId, { skip });
  let user;

  useEffect(() => {
    if (isSuccessPost) {
      setUserId(post.userId);
      setSkip(false);
    }
  }, [isSuccessPost, isSuccessUser]);

  if (isSuccessUser) {
    let { ids, entities } = userData;
    user = entities[ids[0]];
  }

  //! Tags / Colors
  const { data: tags, isSuccess: isSuccessTags } = useGetTagsByPostIdQuery(postId);
  let colors;
  if (isSuccessTags) {
    const { ids, entities } = tags;
    colors = ids.map((id) => entities[id].color);
  }

  const renders = React.useRef(0);

  return (
    <AnimatedBorder colors={colors}>
      <div>Post Renders: {renders.current++}</div>
      <article className='post-feed'>
        <div className='post-header'>
          <Link to={`/user/${post?.userId}`}>
            <h3>
              {user?.username}
              {`temp`}
            </h3>
          </Link>
          <Link to={`/post/${postId}`}>
            {/* TODO, post page, maybe not needed? */}
            <h2>{post?.title}</h2>
          </Link>
          <div className='post-tags'>
            {isSuccessTags ? <TagGroup tags={tags} containerType={"POST"} /> : null}
          </div>
        </div>
        <div className='post-body'>
          <Soundbar />
        </div>
        <div className='post-footer'>
          <div className='description'>
            <p>{isSuccessPost && post?.desc.substring(0, 75)}</p>
          </div>
          <hr className='divider' />
          <div className='comment-section'>
            {isSuccessPost && post?.comments.length ? (
              <CommentSection postId={postId} />
            ) : null}
          </div>
          <div className='timestamp'>
            <TimeAgo timestamp={post?.createdAt} />
          </div>
          <div className='likes'>Likes: {post?.likes.length}</div>
        </div>
      </article>
    </AnimatedBorder>
  );
};

export default Post;
