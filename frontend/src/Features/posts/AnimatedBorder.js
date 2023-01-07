import React, { useState, useEffect } from "react";
import "../../styles.scss";

const AnimatedBorder = ({ colors, children }) => {
  const [currentColorIndex, setCurrentColorIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentColorIndex((prevColorIndex) => {
        const newColorIndex = prevColorIndex + 1;
        if (newColorIndex >= colors.length) {
          return 0;
        }
        return newColorIndex;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [colors]);

  const style = {
    border: `2px solid ${colors[currentColorIndex]}`,
    borderRadius: `15px`,
    animation: "color-animation 5s linear infinite",
  };

  return <div style={style}>{children}</div>;
};

export default AnimatedBorder;
