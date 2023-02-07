import { useEffect, memo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSendLogoutMutation } from "../../Features/Auth/authApiSlice";
import useAuth from "../../hooks/useAuth";
import { useSpring, animated } from "@react-spring/web";
import useMeasure from "react-use-measure";

import { Plus, LogOut, Tag, PlusSquare } from "react-feather";

const HeaderProfile = ({ setModalType }) => {
  const { userId, username, imageUrl } = useAuth();
  const [sendLogout, { isLoading, isSuccess, isError, error }] = useSendLogoutMutation();
  const navigate = useNavigate();

  const onLogoutClicked = () => {
    sendLogout();
    navigate("/");
  };

  useEffect(() => {}, [isSuccess, navigate]);

  if (isLoading) return <p>Logging Out...</p>;
  if (isError) return <p>Error: {error.data.message}</p>;

  //! Animation

  const [addNewRref, addNewBounds] = useMeasure();
  const [profileRef, profileBounds] = useMeasure();

  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isCollapsedProfile, setIsCollapsedProfile] = useState(true);

  const addNewContentAnimatedStyle = useSpring({
    height: isCollapsed ? 0 : addNewBounds.height,
  });

  const profileAnimation = useSpring({
    height: isCollapsedProfile ? 0 : profileBounds.height,
    width: isCollapsedProfile ? 0 : profileBounds.width + 60,
  });

  const handleShowNew = (e) => {
    // e.preventDefault();
    setIsCollapsed(false);
  };
  const handleHideNew = (e) => {
    // e.preventDefault();
    setIsCollapsed(true);
  };

  const handleShowProfile = (e) => {
    e.preventDefault();
    setIsCollapsedProfile(false);
  };
  const handleHideProfile = (e) => {
    e.preventDefault();
    setTimeout(() => {});
    setIsCollapsedProfile(true);
  };

  let content;
  if (userId) {
    content = (
      <>
        <div
          className='dropdown'
          onMouseEnter={handleShowProfile}
          onMouseLeave={handleHideProfile}>
          <div ref={profileRef} className='profile-header'>
            <Link to={`/user/${userId}`} style={{ maxHeight: "56px", maxWidth: "56px" }}>
              {imageUrl ? (
                <img src={imageUrl} alt='profile-picture' className='pic-small' />
              ) : (
                <h3 className='header-username'>{username}</h3>
              )}
            </Link>
          </div>

          <animated.div
            className='dropdown-content'
            onClick={onLogoutClicked}
            style={profileAnimation}>
            <div className='dropdown-row-content'>
              <LogOut /> <b>Logout</b>
            </div>
          </animated.div>
        </div>

        <div className='add-new-dropdown'>
          <div className='dropdown' onMouseEnter={handleShowNew} onMouseLeave={handleHideNew}>
            <div className='add-new-header'>
              <Plus color='#ffffff' size='30' />
              <b>Add New</b>
            </div>

            <animated.div className='dropdown-content' style={addNewContentAnimatedStyle}>
              <div ref={addNewRref}>
                <div className='dropdown-row-content up' onClick={() => setModalType("post")}>
                  <PlusSquare color='#ffffff' size='20' />
                  <b>Post</b>
                </div>

                <hr className='menu-devider' />

                <div className='dropdown-row-content down' onClick={() => setModalType("tag")}>
                  <Tag color='#ffffff' size='20' />
                  <b>Tag</b>
                </div>
              </div>
            </animated.div>
          </div>
        </div>
      </>
    );
  } else {
    content = (
      <div className='base-button'>
        <Link to='/'>Login</Link>
      </div>
    );
  }

  return <>{content}</>;
};

export default memo(HeaderProfile);
