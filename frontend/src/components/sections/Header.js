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
  const [isCollapsed, setIsCollapsed] = useState(true);

  const handleModalClose = () => {
    setIsCollapsed(() => true);
    setTimeout(() => {
      setModalType("");
    }, 500);
  };

  const handleModalOpen = (type) => {
    setModalType(type);
    setIsCollapsed(false);
  };

  const modalFadeInAnimatedStyle = useSpring({
    opacity: !isCollapsed ? 1 : 0,
    backdropFilter: `blur(${!isCollapsed ? 3 : 0}px)`,
  });

  let modalContent;
  if (modalType == "post") {
    modalContent = <NewPost handleModalClose={handleModalClose} />;
  } else if (modalType === "tag") {
    modalContent = <NewTag handleModalClose={handleModalClose} />;
  } else {
    modalContent = null;
  }

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
          <HeaderProfile setModalType={handleModalOpen} handleModalClose={handleModalClose} />
        </div>
      </div>
      <div className='modal'>
        <animated.div style={modalFadeInAnimatedStyle}>
          <div className='modal-styles'>
            {modalType && (
              <>
                <div className='x' onClick={handleModalClose}>
                  <X />
                </div>
                {modalContent}
              </>
            )}
          </div>
        </animated.div>
      </div>
    </>
  );
};

export default memo(Header);
