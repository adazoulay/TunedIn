import { Link } from "react-router-dom";
import { Home, TrendingUp, Users, Eye, Bookmark, Headphones } from "react-feather";

const SideBar = () => {
  return (
    <div className='sidebar'>
      <div className='sidebar-content'>
        <Link to='/feed'>
          <div className='sidebar-row'>
            <Home />
            Home
          </div>
        </Link>
        <Link to=''>
          <div className='sidebar-row'>
            <TrendingUp />
            Trending
          </div>
        </Link>
        <Link to=''>
          <div className='sidebar-row'>
            <Users />
            Subscribed
          </div>
        </Link>
        <Link to=''>
          <div className='sidebar-row'>
            <Eye />
            Discover
          </div>
        </Link>
        <Link to=''>
          <div className='sidebar-row'>
            <Bookmark />
            Saved
          </div>
        </Link>
        <Link to=''>
          <div className='sidebar-row'>
            <Headphones />
            Studio
          </div>
        </Link>
      </div>
    </div>
  );
};

export default SideBar;
