import { useGetPostsQuery } from "./postsApiSlice";
import Post from "./Post";

const Feed = () => {
  const { data: posts, isLoading, isSuccess, isError, error } = useGetPostsQuery();

  let content;

  console.log(posts);
  if (isLoading) content = <p>Loading...</p>;

  if (isError) {
    content = <p className='errmsg'>{error?.data?.message}</p>;
  }

  if (isSuccess) {
    const { ids } = posts;
    content = ids?.length ? ids.map((postId) => <Post key={postId} postId={postId} />) : null;
  }

  return <div className='feed'>{content}</div>;
};

export default Feed;
