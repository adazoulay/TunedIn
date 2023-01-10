import React, { useEffect, useState } from "react";

function AnimatedBorder({ children, colors }) {
  const [borderColor, setBorderColor] = useState(["white", "gray"]);

  console.log("AnimatedBorder");
  useEffect(() => {
    let colorsCopy = [...colors];
    if (colorsCopy.length === 1) {
      colorsCopy.push("white", colors[0]);
    } else if (colorsCopy.length <= 5) {
      for (let i = Math.floor(colors.length / 2); i >= 0; i--) {
        colorsCopy.push(colors[i]);
      }
    }
    setBorderColor(colorsCopy);
  }, [colors]);

  return (
    <div
      style={{
        "--angle": "0deg",
        display: "inline-block",
        border: "1.5px solid",
        borderImage: `conic-gradient(from var(--angle), ${borderColor.join(", ")}) 1`,
        animation: "10s rotate linear infinite",
      }}>
      {children}
    </div>
  );
}

export default AnimatedBorder;
