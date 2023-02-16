import { useGetUserQuery } from "./usersApiSlice";
import { useGetTagsByUserIdQuery } from "../tags/tagsApiSlice";
import { useParams, Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

import TagGroup from "../tags/TagGroup";
import Feed from "../posts/Feed";
import FollowButton from "../../components/functionality/FollowButton";
import CopyLinkButton from "../../components/functionality/CopyLinkButton";
import SpotifyAuth from "../spotify/SpotifyAuth";
import { Edit } from "react-feather";

const UserPage = () => {
  let { id: userId } = useParams();
  const { userId: currentUser } = useAuth();

  const { data: userData, isSuccess } = useGetUserQuery(userId);
  const { data: tags } = useGetTagsByUserIdQuery(userId);

  let user;

  if (isSuccess) {
    const { ids, entities } = userData;
    user = ids?.length ? entities[ids[0]] : null;
  }

  let content;
  let logIntoSpot;
  if (isSuccess) {
    if (userId === currentUser) {
      content = (
        <Link to='/user/edit'>
          <Edit size={36} />
        </Link>
      );
      logIntoSpot = <SpotifyAuth userId={userId} />;
    } else {
      content = <FollowButton user={user} />;
    }
  }

  return (
    <>
      <div className='content-header'>
        <div className='user-info'>
          <div className='user-left'>
            <img className='pic-large' src={user?.imageUrl} alt='Profile Picture' />
            <div className='user-header-col'>
              <div className='name-desc'>
                <div className='username'>{user?.username}</div>
                <div className='user-desc'>{user?.desc}</div>
              </div>
              <div className='tag-spotlight'>
                {tags?.ids?.length > 1 && (
                  <>
                    <div>Tag spotlight:</div>
                    <TagGroup tags={tags} type={"tags-user"} />
                  </>
                )}
              </div>
            </div>
          </div>
          <div className='user-right'>
            <div className='social'>
              <div className='follow'>
                <div className='grayed'> {user?.followers.length} Followers</div>
                <div className='grayed'> {user?.following.length} Following</div>
              </div>
              <div>{content}</div>
            </div>
            {logIntoSpot}
          </div>
        </div>
        <div className='copy-link-user'>
          <CopyLinkButton type={"user"} id={userId} />
        </div>
      </div>
      <Feed type='USER' source={userId} />
    </>
  );
};

export default UserPage;
