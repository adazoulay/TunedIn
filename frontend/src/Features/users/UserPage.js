import Feed from "../posts/Feed";
import { useGetUserQuery } from "./usersApiSlice";
import TagGroup from "../tags/TagGroup";
const UserPage = ({ userId }) => {
  const { data: user, isLoading, isSuccess, isError, error } = useGetUserQuery(userId);

  //! Todo: add userDescription to schema

  let content;

  if (isSuccess) {
    const { ids, entities } = user;
    content = ids?.length ? entities[ids[0]] : null;
  }

  return (
    <div className='user-page'>
      <div className='user-header'>
        <div className='user-info'>
          <img
            className='user-page-profile-pic'
            src='profile-picture.png'
            alt='Profile Picture'
          />
          <div className='name-desc'>
            <div className='username'>{content?.username}</div>
            <div className='user-desc'>{content?.desc}</div>
          </div>
          <div className='social'>
            <div>Followers : {content?.followers.length}</div>
            <div>Following : {content?.following.length}</div>
          </div>
          <button className='follow-btn'>Follow</button>
        </div>
        <div className='user-spotlight'>
          <div>Top Tags:</div>
          <div>Spotlight</div> {/*From saved posts*/}
        </div>
      </div>
      <div className='user-body'>
        <Feed />
        {/* Pass some props to feed based on context? Maybe create merged playlist like on spotify? */}
      </div>
    </div>
  );
};

export default UserPage;
