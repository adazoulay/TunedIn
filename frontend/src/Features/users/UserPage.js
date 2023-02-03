import { useGetUserQuery } from "./usersApiSlice";
import { useGetTagsByUserIdQuery } from "../tags/tagsApiSlice";
import { useParams, Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

import TagGroup from "../tags/TagGroup";
import Feed from "../posts/Feed";
import FollowButton from "../../components/functionality/FollowButton";
import { Edit, Link2 } from "react-feather";

const UserPage = () => {
  let { id: userId } = useParams();
  const { userId: currentUser } = useAuth();

  const { data: userData, isSuccess } = useGetUserQuery(userId);
  const { data: tags, isSuccess: isSuccessTags } = useGetTagsByUserIdQuery(userId);

  let user;

  if (isSuccess) {
    const { ids, entities } = userData;
    user = ids?.length ? entities[ids[0]] : null;
  }

  let content;
  if (isSuccess) {
    if (userId === currentUser) {
      content = (
        <Link to='/user/edit'>
          <Edit size={36} />
        </Link>
      );
    } else {
      content = <FollowButton user={user} />;
    }
  }

  const copyLink = () => {
    const link = `http://localhost:3000/user/${userId}`;
    navigator.clipboard.writeText(link);
    alert("Copied the text: " + copyText.value);
  };

  return (
    <>
      <div className='content-header'>
        <div className='user-info'>
          <div className='user-left'>
            <img
              className='user-page-profile-pic'
              src={user?.imageUrl}
              alt='Profile Picture'
            />
            <div className='user-header-col'>
              <div className='name-desc'>
                <div className='username'>{user?.username}</div>
                <div className='user-desc'>{user?.desc}</div>
              </div>
            </div>
          </div>
          <div className='tag-spotlight'>
            {tags?.ids?.length > 1 && (
              <>
                <div>Top Tags:</div>
                <TagGroup tags={tags} type={"tags-user"} />
              </>
            )}
          </div>

          <div className='social'>
            <div className='follow'>{user?.followers.length} Followers</div>
            <div className='follow'>{user?.following.length} Following</div>
          </div>
          <div className='social'>
            {content}
            <div className='user-share' onClick={copyLink}>
              <Link2 />
            </div>
          </div>
        </div>
      </div>
      <Feed type='USER' source={userId} />
    </>
  );
};

export default UserPage;
