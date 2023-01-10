import TimeAgo from "./TimeAgo";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectPostById } from "./postsApiSlice";

import AnimatedBorder from "./AnimatedBorder";
import SoundBar from "./SoundBar";
import TagGroup from "../tags/TagGroup";
import CommentSection from "../comments/CommentSection";
import { useEffect, useState, useRef } from "react";

// ! TODO import ReactionButtons from "./ReactionButtons";
// ! TODO import PostAuthor from "./PostAuthor";
// ! TODO Body content soundbar

const Post = ({ postId }) => {
  const post = useSelector((state) => selectPostById(state, postId));

  const [colors, setColors] = useState([]);

  function handleColorsFetched(fetchedColors) {
    setColors(fetchedColors);
  }

  return (
    <AnimatedBorder colors={colors}>
      <article className='post-feed'>
        <div className='post-header'>
          <Link to={`post/${post.id}`}>
            <h2>{post.title}</h2>
          </Link>
          {/*<PostAuthor userId={post.userId} />*/}
          <div className='post-tags'>
            <TagGroup postId={postId} onColorsFetched={handleColorsFetched} />
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
          <div className='likes'>Likes: {post.likes.length}</div>
        </div>
      </article>
    </AnimatedBorder>
  );
};

export default Post;
