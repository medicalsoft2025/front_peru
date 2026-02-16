import React, { useState } from "react";

export const JairoTest = () => {
  const [count, setCount] = useState<number>(1);
  function onClick() {
    setCount((prev) => prev + 1);
  }
  console.log("reiterisando");
  return (
    <div>
      Hola {count} <button onClick={onClick}>Guardar</button>
    </div>
  );
};
