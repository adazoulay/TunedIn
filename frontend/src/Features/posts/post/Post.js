import React, { memo, createContext, useEffect } from "react";
import { useGetTagsByPostIdQuery } from "../../tags/tagsApiSlice";
import { useGetUserByPostIdQuery, useLazyGetUserQuery } from "../../users/usersApiSlice";
import AnimatedHeader from "../../../components/functionality/AnimatedHeader";
import TagGroup from "../../tags/TagGroup";
import PostHeader from "./PostHeader";
import PostBody from "./PostBody";
import PostFooter from "./PostFooter";

import "./post.scss";

export const PostContext = createContext({
  postId: null,
  repostId: null,
  userId: null,
  userData: null,
  colors: null,
  contentUrl: null,
  contentType: null,
});

const Post = ({ postId, post, repostId }) => {
  const { data: tags, isSuccess: isSuccessTags } = useGetTagsByPostIdQuery(postId);
  const { data: userData, isSuccess: isSuccessUser } = useGetUserByPostIdQuery(postId);

  return (
    <>
      <PostContext.Provider
        value={{
          postId,
          repostId,
          userId: post && post.isRepost ? post.repost.originalPoster : post && post.userId,
          userData: userData?.entities[userData?.ids[0]],
          colors: tags?.ids?.map((id) => tags.entities[id].color),
          contentUrl: post?.content?.contentUrl,
          contentType: post?.content?.contentType,
          postImgUrl: post?.imageUrl,
        }}>
        <article className='post-feed'>
          {tags?.ids?.length ? (
            <AnimatedHeader colors={tags?.ids?.map((id) => tags.entities[id].color)} />
          ) : (
            <></>
          )}
          <div className='post-header'>
            {isSuccessTags && isSuccessUser && <PostHeader title={post?.title} />}
            <div className='post-tags'>
              {isSuccessTags ? <TagGroup tags={tags} type='tag-group' /> : null}
            </div>
          </div>

          {post?.content?.contentUrl && isSuccessTags && isSuccessUser ? (
            <div className='post-body'>
              <PostBody title={post?.title} />
            </div>
          ) : (
            <></>
          )}
          <div className='post-footer'>
            {isSuccessTags && (
              <PostFooter
                postFooterData={{
                  postId,
                  desc: post?.desc,
                  fileName: post?.content?.fileName,
                  metadata: post?.content?.metadata,
                  createdAt: post?.createdAt,
                  likes: post?.likes,
                  views: post?.views,
                }}
              />
            )}
          </div>
        </article>
      </PostContext.Provider>
    </>
  );
};

export default memo(Post);
