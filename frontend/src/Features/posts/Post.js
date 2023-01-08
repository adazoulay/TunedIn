import TimeAgo from "./TimeAgo";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import AnimatedBorder from "./AnimatedBorder";
import SoundBar from "./SoundBar";
import Tag from "../tags/Tag";
import Comment from "../comments/Comment";
import { selectPostById } from "./postsApiSlice";

// ! TODO import ReactionButtons from "./ReactionButtons";
// ! TODO import PostAuthor from "./PostAuthor";
// ! TODO Body content soundbar

const Post = ({ postId }) => {
  const post = useSelector((state) => selectPostById(state, postId));
  console.log("post", post);

  // let comments = post?.comments.length
  //   ? comments.map((commentId) => <div key={commentId}> commentId </div>)
  //   : null;

  return (
    <AnimatedBorder colors={["red"]}>
      <article className='post-feed'>
        <div className='post-header'>
          <h2>{post.title}</h2>
          <p className='postCredit'>
            <Link to={`post/${post.id}`}>View Post</Link>
            {/*<PostAuthor userId={post.userId} />*/}
          </p>
          <div className='post-tags'>
            <Tag tag={"tag"} />
          </div>
        </div>
        <div className='post-body'>
          <SoundBar mp3={"MP3"} />
        </div>
        <div className='post-footer'>
          <p className='description'>{post.desc.substring(0, 75)}</p>{" "}
          {/* If post longer than 75 add ... */}
          <Comment />
          <TimeAgo timestamp={post.createdAt} />
          {/*<ReactionButtons post={post} />*/}
        </div>
      </article>
    </AnimatedBorder>
  );
};

export default Post;
