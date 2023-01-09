import Feed from "../posts/Feed";

const UserPage = () => {
  return (
    <div className='user-page'>
      <div className='user-header'>
        <div className='user-info'>
          <img
            className='user-page-profile-pic'
            src='profile-picture.png'
            alt='Profile Picture'
          />
          <div>
            <div className='username'>User</div>
            <div className='user-desc'>This is where the User description goes</div>
          </div>
          <div className='social'>
            <div>Followers:</div>
            <div>Following:</div>
          </div>
          <button className='follow-btn'>Follow</button>
        </div>
        <div className='user-spotlight'>
          <div>Top Tags:</div>
          <div>Spotlight</div>
        </div>
      </div>
      <div className='user-body'>{/* <Feed /> */}</div>
    </div>
  );
};

export default UserPage;
