import { useEffect, memo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSendLogoutMutation } from "../Features/Auth/authApiSlice";
import useAuth from "../hooks/useAuth";

import { Plus, LogOut, Tag, PlusSquare } from "react-feather";

const HeaderProfile = () => {
  const { userId, username, imageUrl } = useAuth();

  const [sendLogout, { isLoading, isSuccess, isError, error }] = useSendLogoutMutation();

  const onLogoutClicked = () => sendLogout();

  const navigate = useNavigate();

  useEffect(() => {
    if (isSuccess) navigate("/");
  }, [isSuccess, navigate]);

  if (isLoading) return <p>Logging Out...</p>;
  if (isError) return <p>Error: {error.data.message}</p>;

  let content;

  if (userId) {
    content = (
      <>
        <div className='dropdown'>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Link to={`/user/${userId}`} style={{ maxHeight: "56px", maxWidth: "56px" }}>
              {imageUrl ? (
                <img src={imageUrl} alt='profile-picture' className='pic-small' />
              ) : (
                <h3 className='header-username'>{username}</h3>
              )}
            </Link>
          </div>

          <div className='dropdown-content' onClick={onLogoutClicked}>
            <div className='dropdown-row-content'>
              <LogOut /> <b>Logout</b>
            </div>
          </div>
        </div>

        <div className='dropdown'>
          <div className='add-new'>
            <Plus color='#ffffff' size='30' />
            <b>Add New</b>
          </div>

          <div className='dropdown-content'>
            <Link to={"/post/new"}>
              <div className='dropdown-row-content'>
                <PlusSquare color='#ffffff' size='20' />
                <b>Post</b>
              </div>
            </Link>

            <hr className='menu-devider' />

            <Link to={"/tag/new"}>
              <div className='dropdown-row-content'>
                <Tag color='#ffffff' size='20' />
                <b>Tag</b>
              </div>
            </Link>
          </div>
        </div>
      </>
    );
  } else {
    content = <Link to='/signin'>Login</Link>;
  }

  return <>{content}</>;
};

export default memo(HeaderProfile);
