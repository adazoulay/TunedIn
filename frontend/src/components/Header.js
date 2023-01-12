import { Link } from "react-router-dom";
import SearchBar from "./SearchBar";

import ProfilePic from "../resources/ProfilePic.png";
import { Plus } from "react-feather";

const Header = () => {
  const userId = "63bb65f49f39741850f597f9";

  return (
    <div className='header'>
      <div className='search-container'>
        <SearchBar />
      </div>
      <div className='right-container'>
        <Link to={""}>
          <Plus color='#ffffff' size='40' />
        </Link>
        <Link to={`/user/${userId}`}>
          {/* Todo once UserPage done */}
          <img src={ProfilePic} alt='Profile Picture' className='pic-small' />
        </Link>
      </div>
    </div>
  );
};

export default Header;
