import { memo } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import SideBar from "./SideBar";

const DashLayout = () => {
  return (
    <div className='dash-layout'>
      <Header />
      <div className='layout-wrapper'>
        <SideBar />
        <Outlet />
      </div>
    </div>
  );
};

export default memo(DashLayout);
