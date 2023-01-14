import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSendLogoutMutation } from "../Features/Auth/authApiSlice";
import useAuth from "../hooks/useAuth";

import { Plus } from "react-feather";
import { LogOut } from "react-feather";
import ProfilePic from "../resources/ProfilePic.png";

const HeaderProfile = () => {
  const { userId, username, img } = useAuth();
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
        <Link to={""}>
          <Plus color='#ffffff' size='40' />
        </Link>
        <div className='dropdown'>
          <Link to={`/user/${userId}`}>
            <img src={ProfilePic} alt='Profile Picture' className='pic-small' />
          </Link>
          <div className='dropdown-content' onClick={onLogoutClicked}>
            <div className='dopdown-row'>
              <LogOut /> Logout
            </div>
          </div>
        </div>
      </>
    );
  } else {
    content = <Link to='/signin'>Login</Link>;
  }

  return <>{content}</>;
};

export default HeaderProfile;
