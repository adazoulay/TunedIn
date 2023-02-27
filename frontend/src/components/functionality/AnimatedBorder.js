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

        borderLeft: type !== "post" && "0.5px solid",
        borderRight: type !== "post" && "0.5px solid",
        borderTop: "none",
        borderBottom: "none",
        // borderTop: "0.5px solid",
        // borderBottom: "0.5px solid",

        borderImage:
          isVisible && `conic-gradient(from var(--angle), ${borderColor.join(", ")}) 1`,
        animation: isVisible && "15s rotate linear infinite",
      }}>
      {children}
    </div>
  );
};

export default memo(AnimatedBorder, (prevPros, nextProps) => {
  return JSON.stringify(prevPros.colors) === JSON.stringify(nextProps.colors);
});

// import React, { memo, useMemo } from "react";
// import useIntersectionObserver from "../../hooks/useIntersectionObserver";

// const AnimatedBorder = ({ children, colors, type }) => {
//   const [containerRef, isVisible] = useIntersectionObserver({
//     root: null,
//     rootMargin: "0px",
//     threshhold: 0,
//   });

//   const calculateColors = () => {
//     if (colors) {
//       let colorsCopy = [...colors];
//       if (colorsCopy.length === 1) {
//         colorsCopy.push("white", colors[0]);
//       } else if (colorsCopy.length <= 5) {
//         for (let i = Math.floor(colors.length / 2); i >= 0; i--) {
//           colorsCopy.push(colors[i]);
//         }
//       }
//       return colorsCopy;
//     } else {
//       return ["white", "gray", "white"];
//     }
//   };

//   const borderColor = useMemo(() => calculateColors(colors), [colors]);

//   return (
//     <div
//       ref={containerRef}
//       className='border-test-before'
//       style={{
//         background: `linear-gradient(
//             45deg,
//            ${borderColor.join(", ")}
//           )`,
//       }}>
//       <div className='border-test'>{children}</div>
//     </div>
//   );
// };

// export default memo(AnimatedBorder, (prevPros, nextProps) => {
//   return JSON.stringify(prevPros.colors) === JSON.stringify(nextProps.colors);
// });
