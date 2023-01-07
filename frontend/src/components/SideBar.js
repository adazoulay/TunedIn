import { Link } from "react-router-dom";

const SideBar = () => {
  return (
    <div className='sidebar'>
      <div className='sidebar-content'>
        <Link>Following</Link>
        <Link>Recommended</Link>
        <Link>Popular Tags</Link>
        <Link>Button 4</Link>
        <Link>Button 5</Link>
        <Link>Button 5</Link>
      </div>
    </div>
  );
};

export default SideBar;
