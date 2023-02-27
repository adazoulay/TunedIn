import { useGetUserQuery } from "./usersApiSlice";
import { useGetTagsByUserIdQuery } from "../tags/tagsApiSlice";
import { useParams, Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

import TagGroup from "../tags/TagGroup";
import Feed from "../posts/Feed";
import FollowButton from "../../components/functionality/FollowButton";
import CopyLinkButton from "../../components/functionality/CopyLinkButton";
import SpotifyConnectButton from "../spotify/SpotifyConnectButton";
import SpotifySpotlight from "../spotify/SpotifySpotlight";

import { Edit } from "react-feather";

const UserPage = () => {
  let { id: userId } = useParams();
  const { userId: currentUser, spotifyId } = useAuth();

  const { data: userData, isSuccess } = useGetUserQuery(userId);
  const { data: tags } = useGetTagsByUserIdQuery(userId);

  let user;
  let tracks;

  if (isSuccess) {
    const { ids, entities } = userData;
    user = ids?.length ? entities[ids[0]] : null;
    // tracks =
  }

  let content;
  let spotifyContent;
  if (isSuccess) {
    if (userId === currentUser) {
      content = (
        <Link to='/user/edit'>
          <Edit size={36} />
        </Link>
      );
      if (user.spotifyId) {
        spotifyContent = (
          <>
            <SpotifySpotlight spotifyTrackIds={user.spotifyTrackIds} />
          </>
        );
      } else {
        spotifyContent = <SpotifyConnectButton userId={userId} />;
      }
    } else {
      content = <FollowButton user={user} />;
      spotifyContent = user.spotifyId && (
        <SpotifySpotlight userId={userId} spotifyTrackIds={user.spotifyTrackIds} />
      );
      // spotifyContent = <SpotifySpotlight spotifyTrackIds={user.spotifyTrackIds} />;
    }
  }

  return (
    <>
      <div className='content-header'>
        <div className='user-info'>
          <div className='user-left'>
            <div className='base-user-info'>
              <img className='pic-large' src={user?.imageUrl} alt='Profile Picture' />
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
                  <div>Tag spotlight</div>
                  <TagGroup tags={tags} type={"tags-user"} />
                </>
              )}
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
            {spotifyContent}
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
