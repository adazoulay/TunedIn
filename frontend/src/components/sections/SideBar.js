import { Link } from "react-router-dom";
import {
  Home,
  TrendingUp,
  Users,
  Tag,
  Bookmark,
  Headphones,
  Volume2,
  PieChart,
} from "react-feather";
import SideBarTags from "../../Features/tags/SideBarTags";

const SideBar = () => {
  return (
    <div className='sidebar'>
      <div className='sidebar-content'>
        {/* LINKS */}
        <div className='sidebar-section'>
          <div className='sidebar-row'>
            <Link to='/feed'>
              <div className='row-content'>
                <Home size={26} />
                Home
              </div>
            </Link>
          </div>
          <div className='sidebar-row'>
            <Link to='/feed/trend'>
              <div className='row-content'>
                <TrendingUp size={26} />
                Trending
              </div>
            </Link>
          </div>
          <div className='sidebar-row'>
            <Link to='/feed/sub'>
              <div className='row-content'>
                <Users size={26} />
                Following
              </div>
            </Link>
          </div>
        </div>
        <hr className='sidebar-devider' />
        {/* TAGS */}
        <div className='sidebar-section'>
          <div className='sidebar-tag-section'>
            <div className='content-title'>
              <Tag size={26} />
              Trending Tags
            </div>
            <div className='sidebar-tags-wrapper'>
              <SideBarTags />
            </div>
          </div>
        </div>
        <hr className='sidebar-devider' />
        {/* REST */}
        <div className='sidebar-section'>
          <div className='sidebar-row'>
            <Link to='/feed/saved'>
              <div className='row-content'>
                <Bookmark size={26} />
                Saved
              </div>
            </Link>
          </div>
          <div className='sidebar-row'>
            <Link to=''>
              <div className='row-content'>
                <Volume2 size={26} />
                Broadcast
              </div>
            </Link>
          </div>
        </div>
        <hr className='sidebar-devider' />
        <div className='sidebar-section'>
          <div className='sidebar-row'>
            <Link to=''>
              <div className='row-content'>
                <PieChart size={26} />
                Analytics
              </div>
            </Link>
          </div>
          <div className='sidebar-row'>
            <Link to=''>
              <div className='row-content'>
                <Headphones size={26} />
                Studio
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
