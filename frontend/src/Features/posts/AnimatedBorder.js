import React, { useEffect, useState, memo } from "react";
import useIntersectionObserver from "../../hooks/useIntersectionObserver";

//! ONLY ANIMATE WHEN ENTERS VIEW?
const AnimatedBorder = ({ children, colors }) => {
  const [borderColor, setBorderColor] = useState(["white", "gray", "white"]);

  const [containerRef, isVisible] = useIntersectionObserver({
    root: null,
    rootMargin: "0px",
    threshhold: 0,
  });

  useEffect(() => {
    if (colors) {
      let colorsCopy = [...colors];
      if (colorsCopy.length === 1) {
        colorsCopy.push("white", colors[0]);
      } else if (colorsCopy.length <= 5) {
        for (let i = Math.floor(colors.length / 2); i >= 0; i--) {
          colorsCopy.push(colors[i]);
        }
      }
      setBorderColor(colorsCopy);
    }
  }, [colors]);

  return (
    <div
      ref={containerRef}
      style={{
        "--angle": "0deg",
        display: "inline-block",
        border: "1.5px solid",
        borderImage: `conic-gradient(from var(--angle), ${borderColor.join(", ")}) 1`,
        animation: isVisible && "10s rotate linear infinite",
      }}>
      {children}
    </div>
  );
};

// export default AnimatedBorder;

export default memo(AnimatedBorder, (prevPros, nextProps) => {
  return JSON.stringify(prevPros.colors) === JSON.stringify(nextProps.colors);
});
