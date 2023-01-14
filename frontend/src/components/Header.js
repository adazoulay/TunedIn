import { memo } from "react";
import SearchBar from "./SearchBar";
import HeaderProfile from "./HeaderProfile";

const Header = () => {
  return (
    <div className='header'>
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
