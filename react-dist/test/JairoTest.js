import React, { useState } from "react";
export const JairoTest = () => {
  const [count, setCount] = useState(1);
  function onClick() {
    setCount(prev => prev + 1);
  }
  console.log("reiterisando");
  return /*#__PURE__*/React.createElement("div", null, "Hola ", count, " ", /*#__PURE__*/React.createElement("button", {
    onClick: onClick
  }, "Guardar"));
};