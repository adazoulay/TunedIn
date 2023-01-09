import { Link } from "react-router-dom";

const SideBar = () => {
  return (
    <div className='sidebar'>
      <div className='sidebar-content'>
        <Link to='/feed'>Home</Link>
        <Link to='/Hehe'>Recommended</Link>
        <Link to=''>Popular Tags</Link>
        <Link to=''>Button 4</Link>
        <Link to=''>Button 5</Link>
        <Link to=''>Button 5</Link>
      </div>
    </div>
  );
};

export default SideBar;
