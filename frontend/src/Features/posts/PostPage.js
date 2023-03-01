import React from "react";
import { useGetPostQuery } from "./postsApiSlice";
import { useGetTagsByPostIdQuery } from "../tags/tagsApiSlice";
import { useGetUserByPostIdQuery } from "../users/usersApiSlice";
import { useParams, Link } from "react-router-dom";
import { PostContext } from "./post/Post";

import TagGroup from "../tags/TagGroup";
import AnimatedBorder from "../../components/functionality/AnimatedBorder";
import PostBody from "./post/PostBody";
import CommentSection from "../comments/CommentSection";
import LikePostButton from "./post/buttons/LikePostButton";
import SavePostButton from "./post/buttons/SavePostButton";
import CopyLinkButton from "../../components/functionality/CopyLinkButton";
import MediaInfoButton from "../../components/functionality/audio/MediaInfoButton";

import "./post/post.scss";

const PostPage = () => {
  let { id: postId } = useParams();

  const { data: postData, isSuccess: isSuccessPost } = useGetPostQuery(postId);
  const { data: tagsData, isSuccess: isSuccessTags } = useGetTagsByPostIdQuery(postId);
  const { data: userData, isSuccess: isSuccessUser } = useGetUserByPostIdQuery(postId);

  const post = postData?.entities[postData?.ids[0]];
  const tags = tagsData;
  const user = userData?.entities[userData?.ids[0]];

  let userContent = user?.imageUrl ? (
    <div className='user-section'>
      <img src={user?.imageUrl} alt='profile-picture' className='pic-large' />
      <h3 className='post-username'>{user?.username}</h3>
    </div>
  ) : (
    <h3 className='post-username'>{user?.username}</h3>
  );

  return (
    <>
      {isSuccessTags && isSuccessUser && isSuccessPost && (
        <div className='content-header'>
          {/* <AnimatedHeader colors={tags?.ids?.map((id) => tags.entities[id].color)} /> */}
          <div className='post-page-header'>
            <Link to={`/user/${post.userId}`}>{userContent}</Link>
            <Link to={`/post/${postId}`}>
              <h2 className='post-title'>{post.title}</h2>
            </Link>
            <div className='post-tags'>
              {isSuccessTags ? <TagGroup tags={tags} type='tag-group' /> : null}
            </div>
          </div>
        </div>
      )}

      {post?.contentType && post?.contentUrl && isSuccessTags && (
        <AnimatedBorder colors={tags?.ids?.map((id) => tags.entities[id].color)} type={"post"}>
          <PostContext.Provider
            value={{
              postId,
              userId: post?.userId,
              userData: userData?.entities[userData?.ids[0]],
              colors: tags?.ids?.map((id) => tags.entities[id].color),
              contentUrl: post?.contentUrl,
              contentType: post?.contentType,
            }}>
            <div className='post-body'>
              <PostBody title={post.title} />
            </div>
          </PostContext.Provider>
        </AnimatedBorder>
      )}
      <div className='post-page-footer'>
        <MediaInfoButton fileName={post?.fileName} contentUrl={post?.contentUrl} />
        <div className='description'>
          <p>{post?.desc}</p>
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
              <LikePostButton postId={postId} likes={post?.likes} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PostPage;
