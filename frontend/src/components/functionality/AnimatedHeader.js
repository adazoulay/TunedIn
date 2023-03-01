import React, { memo, useMemo } from "react";
import useIntersectionObserver from "../../hooks/useIntersectionObserver";

const AnimatedHeader = ({ colors }) => {
  const [containerRef, isVisible] = useIntersectionObserver({
    root: null,
    rootMargin: "0px",
    threshold: 0,
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
      className='animated-header'
      style={{
        borderRadius: "5px",
        background: `linear-gradient(to left , ${borderColor.join(", ")})`,
        backgroundSize: "200%",
        animation: isVisible && "15s moveGradient linear infinite",
        animationName: isVisible && "moveGradient",
      }}></div>
  );
};

export default memo(AnimatedHeader, (prevPros, nextProps) => {
  return JSON.stringify(prevPros.colors) === JSON.stringify(nextProps.colors);
});
