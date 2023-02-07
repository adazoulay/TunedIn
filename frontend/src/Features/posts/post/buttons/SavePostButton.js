import React, { useEffect, useState } from "react";
import { Bookmark } from "react-feather";
import { useSavePostMutation, useUnSavePostMutation } from "../../postsApiSlice";
import useAuth from "../../../../hooks/useAuth";

const BookmarkButton = ({ postId }) => {
  const [savedStatus, setSavedStatus] = useState(false);
  const { saved } = useAuth();

  // console.log("STUFF", postId, saved);

  const [savePost] = useSavePostMutation();
  const [unSavePost] = useUnSavePostMutation();

  useEffect(() => {
    if (saved && saved.includes(postId) && !savedStatus) {
      setSavedStatus(() => true);
    }
  }, []);

  const handleBookmarkClicked = async () => {
    if (!savedStatus) {
      await savePost({ id: postId });
      setSavedStatus(true);
    } else {
      await unSavePost({ id: postId });
      setSavedStatus(false);
    }
  };

  return (
    <div className='bookmark-icon' onClick={handleBookmarkClicked}>
      <Bookmark
        size={30}
        strokeWidth={1.5}
        fill={savedStatus ? "#1E90FF" : ""}
        stroke='#1E90FF'
      />
    </div>
  );
};

export default BookmarkButton;
