import React, { useEffect, useState } from "react";
import { Bookmark } from "react-feather";
import { useSavePostMutation, useUnSavePostMutation } from "../../postsApiSlice";
import useAuth from "../../../../hooks/useAuth";

const BookmarkButton = ({ postId }) => {
  const [savedStatus, setSavedStatus] = useState(false);
  const { saved } = useAuth();

  const [savePost] = useSavePostMutation();
  const [unSavePost] = useUnSavePostMutation();

  useEffect(() => {
    if (saved && saved.includes(postId) && !savedStatus) {
      setSavedStatus(() => true);
    }
  }, []);

  const handleBookmarkClicked = async () => {
    if (!savedStatus) {
      setSavedStatus(true);
      await savePost({ id: postId });
    } else {
      setSavedStatus(false);
      await unSavePost({ id: postId });
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
