import TimeAgo from "./TimeAgo";
import { Link } from "react-router-dom";
import AnimatedBorder from "./AnimatedBorder";
import SoundBar from "./SoundBar";
import Tag from "../tags/Tag";
import Comment from "../comments/Comment";

// ! TODO import ReactionButtons from "./ReactionButtons";
// ! TODO import PostAuthor from "./PostAuthor";
// ! TODO Body content soundbar

const Post = () => {
  let post = {
    id: 1,
    user_id: 1,
    title: "My Song",
    body: "This is my first song, please like and comment",
  };

  return (
    <AnimatedBorder colors={["red", "purple", "orange"]}>
      <article className='post-feed'>
        <div className='post-header'>
          <h2>{post.title}</h2>
          <p className='postCredit'>
            <Link to={`post/${post.id}`}>View Post</Link>
            {/*<PostAuthor userId={post.userId} />*/}
            <TimeAgo timestamp={post.date} />
          </p>
          <div className='post-tags'>
            <Tag tag={"tag"} />
            <Tag tag={"tag"} />
            <Tag tag={"tag"} />
          </div>
        </div>
        <div className='post-body'>
          <SoundBar mp3={"MP3"} />
        </div>
        <div className='post-footer'>
          <p className='description'>{post.body.substring(0, 75)}...</p>
          <Comment />
          <Comment />
          <Comment />
          {/*<ReactionButtons post={post} />*/}
        </div>
      </article>
    </AnimatedBorder>
  );
};

export default Post;
