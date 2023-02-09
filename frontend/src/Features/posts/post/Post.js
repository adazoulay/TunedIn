import React, { memo } from "react";
import { useGetTagsByPostIdQuery } from "../../tags/tagsApiSlice";
import { useGetPostsQuery } from "../postsApiSlice";
import { useGetUserByPostIdQuery } from "../../users/usersApiSlice";
import AnimatedBorder from "../../../components/functionality/AnimatedBorder";
import TagGroup from "../../tags/TagGroup";
import PostHeader from "./PostHeader";
import PostFooter from "./PostFooter";
import PostBody from "./PostBody";
import "./post.scss";

//TODO Can react with emotes during song. Plays to other users like insta live emotes

const Post = ({ postId, postArgs }) => {
  const { post } = useGetPostsQuery(postArgs, {
    selectFromResult: ({ data }) => ({
      post: data?.entities[postId],
    }),
  });

  const { data: tags, isSuccess: isSuccessTags } = useGetTagsByPostIdQuery(postId);

  const { data: userData, isSuccess: isSuccessUser } = useGetUserByPostIdQuery(postId);

  return (
    <article className='post-feed'>
      <div>{/* {postArgs.type} {postArgs.page} */}</div>
      <div className='post-header'>
        {isSuccessTags && isSuccessUser && (
          <PostHeader
            postHeaderData={{
              postId,
              userId: post?.userId,
              title: post?.title,
            }}
            userData={userData.entities[userData.ids[0]]}
          />
        )}
        <div className='post-tags'>
          {isSuccessTags ? <TagGroup tags={tags} type='tag-group' /> : null}
        </div>
      </div>
      {post?.audioUrl && isSuccessTags && isSuccessUser ? (
        <AnimatedBorder colors={tags?.ids?.map((id) => tags.entities[id].color)} type={"post"}>
          <div className='post-body'>
            <PostBody
              audioUrl={post.audioUrl}
              colors={tags?.ids?.map((id) => tags.entities[id].color)}
              postId={postId}
              title={post?.title}
              userData={userData.entities[userData.ids[0]]}
            />
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
  );
};

export default memo(Post);
