import TimeAgo from "./TimeAgo";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectPostById } from "./postsApiSlice";

import AnimatedBorder from "./AnimatedBorder";
import SoundBar from "./SoundBar";
import TagGroup from "../tags/TagGroup";
import CommentSection from "../comments/CommentSection";

// ! TODO import ReactionButtons from "./ReactionButtons";
// ! TODO import PostAuthor from "./PostAuthor";
// ! TODO Body content soundbar

const Post = ({ postId }) => {
  const post = useSelector((state) => selectPostById(state, postId));

  return (
    <AnimatedBorder colors={["red"]}>
      <article className='post-feed'>
        <div className='post-header'>
          <Link to={`post/${post.id}`}>
            <h2>{post.title}</h2>
          </Link>
          {/*<PostAuthor userId={post.userId} />*/}
          <div className='post-tags'>
            <TagGroup />
          </div>
        </div>
        <div className='post-body'>
          <SoundBar mp3={"MP3"} />
        </div>
        <div className='post-footer'>
          <div className='description'>
            <b>Description : </b>
            {/* Add Username through virtual mongoose */}
            <p>{post.desc.substring(0, 75)}</p>
          </div>
          {/* If post longer than 75 add ... */}
          <div className='comment-section'>
            {post.comments.length ? <CommentSection postId={postId} /> : null}
          </div>
          <div className='timestamp'>
            <TimeAgo timestamp={post.createdAt} />
          </div>
          {/*<ReactionButtons post={post} />*/}
        </div>
      </article>
    </AnimatedBorder>
  );
};

export default Post;
