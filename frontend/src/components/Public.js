import { Link } from "react-router-dom";
import Signin from "../Features/Auth/Signin";
import Signup from "../Features/Auth/Signup";
import AnimatedBorder from "../Features/posts/AnimatedBorder";

const Public = () => {
  const content = (
    <div className='dash-layout'>
      <div className='header'>Header</div>
      <div className='content-page'>
        <div className='auth-menu'>
          <AnimatedBorder colors={["purple", "red", "orange", "yellow", "pink"]}>
            <Signin />
          </AnimatedBorder>
          <AnimatedBorder colors={["purple", "red", "orange", "yellow", "pink"]}>
            <Signup />
          </AnimatedBorder>
        </div>
      </div>
      {/* <div>Footer</div> */}
    </div>
  );
  return content;
};
export default Public;
