import { memo } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import SideBar from "./SideBar";

const DashLayout = () => {
  return (
    <div className='dash-layout'>
      <Header />
      <div>
        <SideBar />
        <div className='content-page'>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashLayout;
// memo(DashLayout);
