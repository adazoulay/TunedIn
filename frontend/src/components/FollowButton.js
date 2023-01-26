import React, { useState, useEffect } from "react";
import {
  useFollowUserMutation,
  useUnFollowUserMutation,
  useFollowTagMutation,
  useUnFollowTagMutation,
} from "../Features/users/usersApiSlice";
import {} from "../Features/users/usersApiSlice";
import useAuth from "../hooks/useAuth";

const FollowButton = ({ user, tag }) => {
  if (user) {
    const { _id: userId, followers } = user; //Maybe get from parent instead
    const { userId: currentUser } = useAuth();

    const [followUser] = useFollowUserMutation();
    const [unFollowUser] = useUnFollowUserMutation();

    const [followStatus, setFollowStatus] = useState(false);

    if (!userId) {
      return <p>Loading...</p>;
    }

    useEffect(() => {
      if (followers && followers.includes(currentUser) && !followStatus) setFollowStatus(true);
    }, [followers]);

    const handleLikeClicked = async () => {
      if (!followStatus) {
        const newFollowers = [...followers, `${currentUser}`];
        followUser({ id: userId, newFollowers });
        setFollowStatus(() => true);
      } else {
        const newFollowers = followers.filter((id) => id !== currentUser);
        unFollowUser({ id: userId, newFollowers });
        setFollowStatus(() => false);
      }
    };

    return (
      <button
        className='follow-button'
        onClick={handleLikeClicked}
        style={{ backgroundColor: `${followStatus ? "#808080" : "#4673f3"}` }}>
        {`${followStatus ? `Following` : `Follow`}`}
      </button>
    );
  } else {
    // ! TAGS
    const { _id: tagId, followers } = tag;
    const { userId: currentUser } = useAuth();

    const [followTag] = useFollowTagMutation();
    const [unfollowTag] = useUnFollowTagMutation();

    const [followStatus, setFollowStatus] = useState(false);

    if (!tagId) {
      return <p>Loading...</p>;
    }

    useEffect(() => {
      if (followers && followers.includes(currentUser) && !followStatus) setFollowStatus(true);
    }, [followers]);

    const handleLikeClicked = async () => {
      if (!followStatus) {
        const newFollowers = [...followers, `${currentUser}`];
        followTag({ id: tagId, newFollowers });
        setFollowStatus(() => true);
      } else {
        const newFollowers = followers.filter((id) => id !== currentUser);
        unfollowTag({ id: tagId, newFollowers });
        setFollowStatus(() => false);
      }
    };

    return (
      <button
        className='follow-button'
        onClick={handleLikeClicked}
        style={{ backgroundColor: `${followStatus ? "#808080" : "#4673f3"}` }}>
        {`${followStatus ? `Following` : `Follow`}`}
      </button>
    );
  }
};

export default FollowButton;
