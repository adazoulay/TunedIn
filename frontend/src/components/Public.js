import { Link } from "react-router-dom";
import Signin from "../Features/Auth/Signin";
import AnimatedBorder from "../Features/posts/AnimatedBorder";

const Public = () => {
  const content = (
    <div className='layout-wrapper'>
      <div className='header'>Header</div>
      <div className='welcome-body'>
        <div className='login-section'>
          <AnimatedBorder colors={["purple", "red", "orange", "yellow", "pink"]}>
            <Signin />
          </AnimatedBorder>
        </div>
      </div>
      <div>Footer</div>
    </div>
  );
  return content;
};
export default Public;
