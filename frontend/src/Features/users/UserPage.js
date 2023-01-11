import Feed from "../posts/Feed";
import { useGetUserQuery } from "./usersApiSlice";
import { useGetTagsByUserIdQuery } from "../tags/tagsApiSlice";
import TagGroup from "../tags/TagGroup";
const UserPage = ({ userId }) => {
  const { data: userData, isSuccess } = useGetUserQuery(userId);
  const { data: tags, isSuccess: isSuccessTags } = useGetTagsByUserIdQuery(userId);

  let user;

  if (isSuccess) {
    const { ids, entities } = userData;
    user = ids?.length ? entities[ids[0]] : null;
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
            <div className='username'>{user?.username}</div>
            <div className='user-desc'>{user?.desc}</div>
          </div>
          <div className='social'>
            <div>Followers : {user?.followers.length}</div>
            <div>Following : {user?.following.length}</div>
          </div>
          <button className='follow-btn'>Follow</button>
        </div>
        <div className='user-spotlight'>
          <div className='tag-spotlight'>
            Top Tags:
            <TagGroup tags={tags} containerType={"USER"} />
            {/* Optional params... */}
          </div>
          <div>Spotlight</div> {/*From saved posts*/}
        </div>
      </div>
      <div className='user-body'>
        <Feed type='USER' source={userId} />
      </div>
    </div>
  );
};

export default UserPage;
