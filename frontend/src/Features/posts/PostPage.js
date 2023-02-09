import React, { useEffect } from "react";
import { useGetPostQuery } from "./postsApiSlice";
import { useGetTagsByPostIdQuery } from "../tags/tagsApiSlice";
import { useGetUserByPostIdQuery } from "../users/usersApiSlice";
import { useParams, Link } from "react-router-dom";

import TagGroup from "../tags/TagGroup";

const PostPage = () => {
  let { id: postId } = useParams();

  const { data: postData, isSuccess: isSuccessPost } = useGetPostQuery(postId);
  const { data: tagsData, isSuccess: isSuccessTags } = useGetTagsByPostIdQuery(postId);
  const { data: userData, isSuccess: isSuccessUser } = useGetUserByPostIdQuery(postId);

  const post = postData?.entities[postData?.ids[0]];
  const tags = tagsData;
  const user = userData?.entities[userData?.ids[0]];

  useEffect(() => {
    console.log(isSuccessPost, isSuccessTags, isSuccessUser);
  }, [isSuccessPost, isSuccessTags, isSuccessUser]);

  let userContent = user?.imageUrl ? (
    <div className='post-user'>
      <img src={user?.imageUrl} alt='profile-picture' className='pic-small' />
      <h3 className='post-username'>{user?.username}</h3>
    </div>
  ) : (
    <h3 className='post-username'>{user?.username}</h3>
  );

  return (
    <div>
      {isSuccessTags && isSuccessUser && isSuccessPost && (
        <div className='post-page-header'>
          <Link to={`/user/${post.userId}`}>{userContent}</Link>
          <Link to={`/post/${postId}`}>
            <h2 className='post-title'>{post.title}</h2>
          </Link>
        </div>
      )}
      <div className='post-tags'>
        {isSuccessTags ? <TagGroup tags={tags} type='tag-group' /> : null}
      </div>
      <div className='post-page-body'></div>
      <div className='post-page-footer'></div>
    </div>
  );
};

export default PostPage;
