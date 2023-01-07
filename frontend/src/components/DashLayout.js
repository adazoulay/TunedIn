import { Outlet } from "react-router-dom";
import Header from "./Header";
import SideBar from "./SideBar";

const DashLayout = () => {
  return (
    <div className='dash-layout'>
      <Header />
      <div className='layout-wrapper'>
        <SideBar className='grid-item grid-item-1' />
        <Outlet className='grid-item grid-item-2' />
      </div>
    </div>
  );
};

export default DashLayout;
