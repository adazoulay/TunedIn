import React, { useEffect, useState } from "react";
import { Bookmark } from "react-feather";
import { useSpring, animated } from "@react-spring/web";

const BookmarkButton = () => {
  const [bookmarked, setBookmarked] = useState(true);

  const modalFadeInAnimatedStyle = useSpring({
    stroke: bookmarked ? "#1E90FF" : "#040404",
  });

  const handleBookmarkClicked = () => {
    setBookmarked((bookmarked) => !bookmarked);
  };

  useEffect(() => {
    console.log("bookmarked", bookmarked);
  }, [bookmarked]);

  return (
    <div className='bookmark-icon' onClick={handleBookmarkClicked}>
      <Bookmark
        size={28}
        stroke={modalFadeInAnimatedStyle.stroke}
        strokeWidth={1.5}
        fill='#1E90FF'
      />
    </div>
  );
};

export default BookmarkButton;
