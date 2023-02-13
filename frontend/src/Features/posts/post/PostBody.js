import React, { useState, useRef, memo, useContext } from "react";
import { useSpring, animated } from "@react-spring/web";
import useMeasure from "react-use-measure";
import { PostContext } from "./Post";
import { useDispatch } from "react-redux";
import { setPlayerInfo } from "../../../components/functionality/audio/playerReducer";
import { useGetCommentsByPostIdQuery } from "../../comments/commentsApiSlice";

import MediaPlayer from "../../../components/functionality/audio/MediaPlayer";
import ContentWrapper from "../../../components/functionality/audio/ContentWrapper";
import CommentList from "../../comments/CommentList";

import { ChevronsUp, ChevronsRight, MessageSquare } from "react-feather";

const PostBody = ({ title }) => {
  const { contentUrl, contentType, postId, userData } = useContext(PostContext);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isCollapseComments, setIsCollapseComments] = useState(true);
  const [sizeRef, bounds] = useMeasure();
  const mediaRef = useRef();

  const dispatch = useDispatch();

  const activateFooter = () => {
    dispatch(
      setPlayerInfo({
        postId,
        contentUrl,
        userImg: userData.imageUrl,
        username: userData.username,
        userId: userData._id,
        title,
      })
    );
  };

  const toggleWrapperAnimatedStyle = useSpring({
    transform: isCollapsed ? "rotate(0deg)" : "rotate(180deg)",
  });

  const panelContentAnimatedStyle = useSpring({
    height: isCollapsed ? 0 : bounds.height,
    config: {
      mass: 0.09,
    },
  });

  const togglePanel = () => {
    setIsCollapsed((prevState) => !prevState);
  };

  const { comments, isSuccess: isSuccessComments } = useGetCommentsByPostIdQuery(postId, {
    selectFromResult: ({ data }) => ({
      comments: data,
    }),
  });

  const toggleComments = () => {
    setIsCollapseComments((prevState) => !prevState);
  };

  return (
    <>
      <div className='footer-controls'>
        {!isCollapsed && contentType.startsWith("video") && (
          <div className='toggle-comments' onClick={toggleComments}>
            <MessageSquare color='#ebebeb' />
          </div>
        )}
        <animated.div
          className='toggle-soundbar'
          style={toggleWrapperAnimatedStyle}
          onClick={togglePanel}>
          {<ChevronsUp color='#ebebeb' />}
        </animated.div>
        <div className='activate-footer' onClick={activateFooter}>
          <ChevronsRight color='#ebebeb' />
        </div>
      </div>

      {contentUrl && (
        <MediaPlayer mediaRef={mediaRef} bodyIsCollapsed={isCollapsed}>
          <animated.div className='content-wrapper' style={panelContentAnimatedStyle}>
            {!isCollapseComments && (
              <div className='body-comments'>
                <CommentList comments={comments} />
              </div>
            )}
            <ContentWrapper mediaRef={mediaRef} sizeRef={sizeRef} isCollapsed={isCollapsed} />
          </animated.div>
        </MediaPlayer>
      )}
    </>
  );
};

export default memo(PostBody);
