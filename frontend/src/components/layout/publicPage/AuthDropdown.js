import React, { useState } from "react";
import Signin from "../../../Features/Auth/Signin";
import Signup from "../../../Features/Auth/Signup";
import AnimatedBorder from "../../functionality/AnimatedBorder";
import { useSpring, animated } from "@react-spring/web";
import useMeasure from "react-use-measure";
import AuthWithSpotify from "./AuthWithSpotify";

const AuthDropdown = () => {
  const [modalType, setModalType] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(true);

  const [ref, bounds] = useMeasure();

  //   const panelContentAnimatedStyle = useSpring({
  //     transform: isCollapsed ? "scale(1, 0)" : "scale(1, 1)",
  //     origin: "top",
  //   });

  const panelContentAnimatedStyle = useSpring({
    height: isCollapsed ? 0 : bounds.height,
    config: {
      mass: 0.05,
      tension: 150,
    },
  });

  const handleDropDownOpen = (type) => {
    setModalType(type);
    setIsCollapsed(false);
  };

  return (
    <div className='auth-menu' ref={ref}>
      <div className='auth-buttons'>
        <AuthWithSpotify />
        <b>OR</b>
        <div className='button-85' onClick={() => handleDropDownOpen("signIn")}>
          Sign In
        </div>
        <div className='button-85' onClick={() => handleDropDownOpen("signUp")}>
          SignUp
        </div>
      </div>
      <animated.div style={panelContentAnimatedStyle} className='public-forms-wrapper'>
        <div>
          {modalType === "signIn" && (
            <AnimatedBorder
              colors={["blue", "purple", "red", "orange", "yellow", "pink", "blue"]}>
              <Signin />
            </AnimatedBorder>
          )}
        </div>
        <div>
          {modalType === "signUp" && (
            <AnimatedBorder
              colors={["blue", "purple", "red", "orange", "yellow", "pink", "blue"]}>
              <Signup />
            </AnimatedBorder>
          )}
        </div>
      </animated.div>
    </div>
  );
};

export default AuthDropdown;
