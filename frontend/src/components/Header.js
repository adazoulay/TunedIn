const Header = () => {
  return (
    <div className="header">
      <div className="search-container">
        <input type="text" placeholder="Search" />
      </div>
      <div className="right-container">
        <button>Upload</button>
        <img src="profile-picture.png" alt="Profile Picture" />
      </div>
    </div>
  );
};

export default Header;
