import { Outlet } from "react-router-dom";
import "../styles.scss";

const Layout = () => {
  return (
    <div>
      <Outlet />
    </div>
  );
};

export default Layout;
