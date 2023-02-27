import React, { memo, useMemo } from "react";
import useIntersectionObserver from "../../hooks/useIntersectionObserver";

const AnimatedBorder = ({ children, colors, type }) => {
  const [containerRef, isVisible] = useIntersectionObserver({
    root: null,
    rootMargin: "0px",
    threshhold: 0,
  });

  const calculateColors = () => {
    if (colors) {
      let colorsCopy = [...colors];
      if (colorsCopy.length === 1) {
        colorsCopy.push("white", colors[0]);
      } else if (colorsCopy.length <= 5) {
        for (let i = Math.floor(colors.length / 2); i >= 0; i--) {
          colorsCopy.push(colors[i]);
        }
      }
      return colorsCopy;
    } else {
      return ["white", "gray", "white"];
    }
  };

  const borderColor = useMemo(() => calculateColors(colors), [colors]);

  return (
    <div
      ref={containerRef}
      style={{
        "--angle": "0deg",
        display: "inline-block",
        width: "100%",
        borderLeft: "none",
        borderRight: "none",
        borderTop: "none",
        bordderBottom: "10px  solid red",
        zIndex: 100,
        borderImage:
          isVisible && `conic-gradient(from var(--angle), ${borderColor.join(", ")}) 1`,
        animation: isVisible && "15s rotate linear infinite",
      }}></div>
  );
};

export default memo(AnimatedBorder, (prevPros, nextProps) => {
  return JSON.stringify(prevPros.colors) === JSON.stringify(nextProps.colors);
});
