import React, { useEffect } from "react";
import { useGetTagsByPostIdQuery } from "../tags/tagsApiSlice";
import AnimatedBorder from "./AnimatedBorder";
import AudioPlayer from "./AudioPlayer";
import TagGroup from "../tags/TagGroup";
import PostHeader from "./PostHeader";
import PostFooter from "./PostFooter";
import { useGetPostsQuery } from "./postsApiSlice";

//! Link icon to copy link
//TODO Can react with emotes during song. Plays to other users like insta live emotes

const Post = ({ postId }) => {
  const { post } = useGetPostsQuery("getPosts", {
    selectFromResult: ({ data }) => ({
      post: data?.entities[postId],
    }),
  });

  const {
    data: tags,
    isLoading: isLoadingTags,
    isSuccess: isSuccessTags,
  } = useGetTagsByPostIdQuery(postId);

  let colors;
  let headerContent;
  let footerContent;

  if (isSuccessTags) {
    const { ids, entities } = tags;
    colors = ids.map((id) => entities[id].color);
  }

  if (isSuccessTags) {
    const postHeaderData = {
      postId,
      userId: post?.userId,
      title: post?.title,
    };
    headerContent = <PostHeader postHeaderData={postHeaderData} />;
    const postFooterData = {
      postId,
      desc: post?.desc,
      createdAt: post?.createdAt,
      likes: post?.likes,
      views: post?.views,
    };
    footerContent = <PostFooter postFooterData={postFooterData} />;
  }

  //! Footer

  return (
    <AnimatedBorder colors={colors}>
      <article className='post-feed'>
        <div className='post-header'>
          {headerContent}
          <div className='post-tags'>
            {isSuccessTags ? <TagGroup tags={tags} type='tag-group' /> : null}
          </div>
        </div>
        <div className='post-body'>
          {post?.audioUrl && colors?.length && (
            <AudioPlayer audio={post?.audioUrl} colors={colors} postId={postId} />
          )}
        </div>
        <div className='post-footer'>{footerContent}</div>
      </article>
    </AnimatedBorder>
  );
};

export default Post;
