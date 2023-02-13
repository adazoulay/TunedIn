import React, { memo, createContext, useRef } from "react";
import { useGetTagsByPostIdQuery } from "../../tags/tagsApiSlice";
import { useGetPostsQuery } from "../postsApiSlice";
import { useGetUserByPostIdQuery } from "../../users/usersApiSlice";
import AnimatedBorder from "../../../components/functionality/AnimatedBorder";
import TagGroup from "../../tags/TagGroup";
import PostHeader from "./PostHeader";
import PostBody from "./PostBody";
import PostFooter from "./PostFooter";
import "./post.scss";

export const PostContext = createContext({
  postId: null,
  userId: null,
  userData: null,
  colors: null,
  contentUrl: null,
  contentType: null,
});

const Post = ({ postId, fetchArgs }) => {
  const { post } = useGetPostsQuery(fetchArgs, {
    selectFromResult: ({ data }) => ({
      post: data?.entities[postId],
    }),
  });
  const { data: tags, isSuccess: isSuccessTags } = useGetTagsByPostIdQuery(postId);
  const { data: userData, isSuccess: isSuccessUser } = useGetUserByPostIdQuery(postId);

  return (
    <PostContext.Provider
      value={{
        postId,
        userId: post?.userId,
        userData: userData?.entities[userData?.ids[0]],
        colors: tags?.ids?.map((id) => tags.entities[id].color),
        contentUrl: post?.contentUrl,
        contentType: post?.contentType,
      }}>
      <article className='post-feed'>
        <div className='post-header'>
          {isSuccessTags && isSuccessUser && <PostHeader title={post?.title} />}
          <div className='post-tags'>
            {isSuccessTags ? <TagGroup tags={tags} type='tag-group' /> : null}
          </div>
        </div>

        {post?.contentUrl && isSuccessTags && isSuccessUser ? (
          <AnimatedBorder
            colors={tags?.ids?.map((id) => tags.entities[id].color)}
            type={"post"}>
            <div className='post-body'>
              <PostBody title={post?.title} />
            </div>
          </AnimatedBorder>
        ) : (
          <hr className='divider-top' />
        )}
        <div className='post-footer'>
          {isSuccessTags && (
            <PostFooter
              postFooterData={{
                postId,
                desc: post?.desc,
                fileName: post?.fileName,
                createdAt: post?.createdAt,
                likes: post?.likes,
                views: post?.views,
              }}
            />
          )}
        </div>
      </article>
    </PostContext.Provider>
  );
};

export default memo(Post);
