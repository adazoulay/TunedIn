import Feed from "../posts/Feed";
import { useGetUserQuery } from "./usersApiSlice";
import { useGetTagsByUserIdQuery } from "../tags/tagsApiSlice";
import TagGroup from "../tags/TagGroup";
import ProfilePic from "../../resources/ProfilePic.png";
import { useParams } from "react-router-dom";
const UserPage = () => {
  let { id: userId } = useParams();

  const { data: userData, isSuccess } = useGetUserQuery(userId);
  const { data: tags, isSuccess: isSuccessTags } = useGetTagsByUserIdQuery(userId);

  let user;

  if (isSuccess) {
    const { ids, entities } = userData;
    user = ids?.length ? entities[ids[0]] : null;
  }

  return (
    <>
      <div className='content-header'>
        <div className='user-info'>
          <img
            className='user-page-profile-pic'
            src={"ProfilePicture"}
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
          <button className='follow-button'>Follow</button>
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
      <Feed type='USER' source={userId} />
    </>
  );
};

export default UserPage;
