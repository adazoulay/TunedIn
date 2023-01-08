import { useGetPostsQuery } from "./postsApiSlice";
import Post from "./Post";

const Feed = () => {
  const { data: posts, isLoading, isSuccess, isError, error } = useGetPostsQuery();

  console.log(posts);

  let content;

  if (isLoading) content = <p>Loading...</p>;

  if (isError) {
    content = <p className='errmsg'>{error?.data?.message}</p>;
  }

  if (isSuccess) {
    const { ids } = posts;
    console.log("Ids", ids);
    content = ids?.length ? ids.map((postId) => <Post key={postId} postId={postId} />) : null;
  }

  return <div className='feed'>{content}</div>;
};

export default Feed;
