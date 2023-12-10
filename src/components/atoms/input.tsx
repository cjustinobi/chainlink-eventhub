import React, { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  className?: string;
};

const Input: React.FC<InputProps> = ({ className, ...rest }) => {
  const combinedClassName = `border w-full border-gray-300 text-customGray1 bg-[#F9F9FB] rounded-lg p-3 focus:outline-none focus:border-customGold ${
    className || ""
  }`;

  return <input {...rest} className={combinedClassName} />;
};

export default Input;
