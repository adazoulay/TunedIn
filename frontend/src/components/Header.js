import { Link } from "react-router-dom";
import SearchBar from "./SearchBar";

const Header = () => {
  return (
    <div className='header'>
      <div className='search-container'>
        {/* <input type='text' placeholder='Search' /> */}
        <SearchBar />
      </div>
      <div className='right-container'>
        <button>Upload</button>
        <Link to='/user'>
          <img src='profile-picture.png' alt='Profile Picture' />
        </Link>
      </div>
    </div>
  );
};

export default Header;
