import React, { useEffect, useState } from "react";
import Signin from "../../../Features/Auth/Signin";
import Signup from "../../../Features/Auth/Signup";
import AnimatedBorder from "../../functionality/AnimatedBorder";
import { useSpring, animated } from "@react-spring/web";
import useMeasure from "react-use-measure";

const AuthDropdown = () => {
  const [modalType, setModalType] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(true);

  const [ref, bounds] = useMeasure();

  const panelContentAnimatedStyle = useSpring({
    height: isCollapsed ? 0 : bounds.height,
    config: {
      mass: 0.05,
    },
  });

  const handleDropDownOpen = (type) => {
    setModalType(type);
    setIsCollapsed(false);
  };

  const handleCloseDropdown = () => {
    setIsCollapsed(true);
  };

  useEffect(() => {
    console.log(isCollapsed);
  }, [isCollapsed]);

  return (
    <div className='auth-menu'>
      <div className='auth-buttons'>
        <div className='button-85' onClick={handleCloseDropdown}>
          Collapse
        </div>
        <div className='button-85' onClick={() => handleDropDownOpen("signIn")}>
          Sign In
        </div>
        <div className='button-85' onClick={() => handleDropDownOpen("signUp")}>
          SignUp
        </div>
      </div>
      <div className='public-forms-wrapper'>
        <animated.div style={modalType === "signIn" ? panelContentAnimatedStyle : {}}>
          {modalType === "signIn" && (
            <AnimatedBorder colors={["purple", "red", "orange", "yellow", "pink"]}>
              <Signin dropDownRef={ref} />
            </AnimatedBorder>
          )}
        </animated.div>
        <animated.div style={modalType === "signUp" ? panelContentAnimatedStyle : {}}>
          {modalType === "signUp" && (
            <AnimatedBorder colors={["purple", "red", "orange", "yellow", "pink"]}>
              <Signup dropDownRef={ref} />
            </AnimatedBorder>
          )}
        </animated.div>
      </div>
    </div>
  );
};

export default AuthDropdown;
