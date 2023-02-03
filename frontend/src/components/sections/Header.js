import { memo, useState } from "react";
import { Link } from "react-router-dom";
import SearchBar from "../functionality/search/SearchBar";
import HeaderProfile from "./HeaderProfile";
import Logo from "../../assets/Logo";
import NewPost from "../../Features/posts/NewPost";
import NewTag from "../../Features/tags/NewTag";
import { useSpring, animated } from "@react-spring/web";
import { X } from "react-feather";

const Header = () => {
  const [modalType, setModalType] = useState("");

  let modalContent;
  if (modalType == "post") {
    modalContent = (
      <>
        <div className='x' onClick={() => setModalType(false)}>
          <X />
        </div>
        <NewPost />
      </>
    );
  } else if (modalType === "tag") {
    modalContent = (
      <>
        <div className='x' onClick={() => setModalType(false)}>
          <X />
        </div>
        <NewTag />
      </>
    );
  } else {
    modalContent = null;
  }

  const modalFadeInAnimatedStyle = useSpring({
    opacity: modalType ? 1 : 0,
    backdropFilter: `blur(${modalType ? 3 : 0}px)`, //! Check performance
  });

  return (
    <>
      <div className='header'>
        <div className='logo'>
          <Link to='/feed'>
            <Logo />
          </Link>
        </div>
        <div className='search-container'>
          <SearchBar />
        </div>
        <div className='dropdown-container'>
          <HeaderProfile setModalType={setModalType} />
        </div>
      </div>
      <div className='modal'>
        <animated.div style={modalFadeInAnimatedStyle}>
          <div className='modal-styles'>{modalContent}</div>
        </animated.div>
      </div>
    </>
  );
};

export default memo(Header);
