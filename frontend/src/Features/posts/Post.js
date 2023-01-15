import React, { useEffect } from "react";
import { useGetTagsByPostIdQuery } from "../tags/tagsApiSlice";
import AnimatedBorder from "./AnimatedBorder";
import Soundbar from "./Soundbar";
import TagGroup from "../tags/TagGroup";
import PostHeader from "./PostHeader";
import PostFooter from "./PostFooter";
import { useGetPostQuery } from "./postsApiSlice";
import { useGetPostsQuery } from "./postsApiSlice";

// ! TODO Body content soundbar
//TODO Can react with emotes during song. Plays to other users like insta live emotes

const Post = ({ postId }) => {
  //! Post
  // const {
  //   data: postData,
  //   isLoading: isLoadingPost,
  //   isSuccess: isSuccessPost,
  // } = useGetPostQuery(postId);

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

  // let post;
  let colors;
  let headerContent;
  let footerContent;

  // if (isSuccessPost) {
  //   const { ids, entities } = postData;
  //   post = entities[ids[0]];
  // }

  if (isSuccessTags) {
    const { ids, entities } = tags;
    colors = ids.map((id) => entities[id].color);
  }

  // if (isSuccessPost && isSuccessTags) {
  if (isSuccessTags) {
    const postHeaderData = {
      postId,
      userId: post.userId,
      title: post.title,
    };
    headerContent = <PostHeader postHeaderData={postHeaderData} />;
    const postFooterData = {
      postId,
      desc: post.desc,
      createdAt: post.createdAt,
      likes: post.likes,
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
            {isSuccessTags ? <TagGroup tags={tags} containerType={"POST"} /> : null}
          </div>
        </div>
        <div className='post-body'>
          <Soundbar />
        </div>
        <div className='post-footer'>{footerContent}</div>
      </article>
    </AnimatedBorder>
  );
};

export default Post;
