import React, { memo } from "react";
import { RefreshCcw } from "react-feather";
import { Link } from "react-router-dom";

const Repost = ({ reposterData }) => {
  let userContent = reposterData?.imageUrl ? (
    <div className='post-user'>
      <img src={reposterData?.imageUrl} alt='profile-picture' className='pic-small' />
      <h3 className='post-username'>{reposterData?.username}</h3>
    </div>
  ) : (
    <h3 className='post-username'>{reposterData?.username}</h3>
  );

  return (
    <div className='repost'>
      <RefreshCcw size={30} />
      <Link to={`/user/${reposterData?._id}`}>{userContent}</Link>
    </div>
  );
};

export default memo(Repost);
