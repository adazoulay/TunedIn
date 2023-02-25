import { Outlet } from "react-router-dom";
import Header from "../sections/Header";
import SideBar from "../sections/SideBar";
import Footer from "../sections/Footer";

const DashLayout = () => {
  return (
    <div className='dash-layout'>
      <Header />
      <div>
        <SideBar />
        <div className='content-page'>
          <Outlet />
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default DashLayout;
// memo(DashLayout);
