import { useParams } from "react-router-dom";
import { useGetTagAndRelatedTagsQuery } from "./tagsApiSlice";
import Feed from "../posts/Feed";
import TagGroup from "../tags/TagGroup";
import Tag from "./Tag";
import FollowButton from "../../components/FollowButton";
import { Link2 } from "react-feather";

const TagPage = () => {
  let { id: tagId } = useParams();

  let tag;
  let parents;
  let children;
  const { data: tagData, isSuccess: isSuccessTag } = useGetTagAndRelatedTagsQuery(tagId);

  if (isSuccessTag) {
    tag = tagData.tag.entities[tagData.tag.ids[0]];
    parents = tagData.parents;
    children = tagData.children;
  }

  const copyLink = () => {
    const link = `http://localhost:3000/tag/${tagId}`;
    navigator.clipboard.writeText(link);
    alert("Copied the text: " + copyText.value);
  };

  return (
    <>
      <div className='content-header'>
        <div className='tag-info'>
          {isSuccessTag && <Tag tagInfo={tag} tagId={tagId} size='large' />}
          <div className='tag-relation'>
            <h3>Parents:</h3>
            {isSuccessTag && parents?.ids.length && (
              <TagGroup tags={parents} type='tags-inheritance' />
            )}{" "}
          </div>
          <div className='tag-relation'>
            <h3>Children:</h3>
            {isSuccessTag && children?.ids.length && (
              <TagGroup tags={children} type='tags-inheritance' />
            )}
          </div>
          {isSuccessTag && (
            <div className='tag-social'>
              <FollowButton tag={tag} />
              <div className='tag-connect'>
                <div className='follow'>{tag.followers?.length} Followers </div>
                <div className='link' onClick={copyLink}>
                  <Link2 />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Feed type={"TAG"} source={tagId} />
    </>
  );
};

export default TagPage;
