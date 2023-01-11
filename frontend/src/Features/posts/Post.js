import TimeAgo from "./TimeAgo";
import { Link } from "react-router-dom";

import AnimatedBorder from "./AnimatedBorder";
import SoundBar from "./SoundBar";
import TagGroup from "../tags/TagGroup";
import CommentSection from "../comments/CommentSection";
import React, { useEffect, useState } from "react";
import { useGetTagsByPostIdQuery } from "../tags/tagsApiSlice";
import { useGetPostsQuery } from "./postsApiSlice";

// ! TODO import ReactionButtons from "./ReactionButtons";
// ! TODO import PostAuthor from "./PostAuthor";
// ! TODO Body content soundbar

//! Some posts don't load on reload

const Post = ({ postId }) => {
  const { data: tags, isSuccess: isSuccessTags } = useGetTagsByPostIdQuery(postId);

  let colors;
  if (isSuccessTags) {
    const { ids, entities } = tags;
    colors = ids.map((id) => entities[id].color);
  }

  const { post } = useGetPostsQuery("getPosts", {
    selectFromResult: ({ data }) => ({
      post: data?.entities[postId],
    }),
  });

  return (
    <AnimatedBorder colors={colors}>
      <article className='post-feed'>
        <div className='post-header'>
          <Link to={`/post/${postId}`}>
            <h2>{post?.title}</h2>
          </Link>
          {/*<PostAuthor userId={post?.userId} />*/}
          <div className='post-tags'>
            {isSuccessTags ? <TagGroup tags={tags} containerType={"POST"} /> : null}
          </div>
        </div>
        <div className='post-body'>
          <SoundBar mp3={"MP3"} />
        </div>
        <div className='post-footer'>
          <div className='description'>
            <b>Description : </b>
            {/* Add Username through virtual mongoose */}
            <p>{post?.desc.substring(0, 75)}</p>
          </div>
          <div className='comment-section'>
            {post?.comments.length ? <CommentSection postId={postId} /> : null}
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
