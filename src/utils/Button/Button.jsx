import React from "react";
import "./Button.css";

const Button = ({ text, color, isDisabled, cb }) => {
  const buttonStyle = {
    backgroundColor: color,
    ...(isDisabled && { filter: "opacity(0.5)" }),
  };

  return (
    <button className="genButton" style={buttonStyle} onClick={cb} disabled={isDisabled}>
      {text}
    </button>
  );
};

export default Button;
