import React, { InputHTMLAttributes } from "react";
import Input from "@/components/atoms/input";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

interface InputGroupProps extends InputProps {
  label: string;
}

const InputGroup: React.FC<InputGroupProps> = ({ label, ...rest }) => {
  return (
    <div>
      <p className="text-base mb-2">{label}</p>
      <Input
        {...rest}
        className="border w-full border-gray-400 text-customGray1 bg-transparent rounded-lg py-3 px-4 focus:outline-none focus:border-customGold"
      />
    </div>
  );
};

export default InputGroup;
