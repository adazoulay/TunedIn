import { Link } from "react-router-dom";

const Header = () => {
  return (
    <div className='header'>
      <div className='search-container'>
        <input type='text' placeholder='Search' />
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
