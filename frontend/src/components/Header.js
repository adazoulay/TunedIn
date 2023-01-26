import { memo } from "react";
import { Link } from "react-router-dom";
import SearchBar from "./SearchBar";
import HeaderProfile from "./HeaderProfile";
import Logo from "../assets/Logo";

const Header = () => {
  return (
    <div className='header'>
      <div className='logo'>
        <Link to='/feed'>
          <Logo />
        </Link>
      </div>
      <div className='search-container'>
        <SearchBar />
      </div>
      <div className='right-container'>
        <HeaderProfile />
      </div>
    </div>
  );
};

export default memo(Header);
