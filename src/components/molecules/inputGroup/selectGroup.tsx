import React, { SelectHTMLAttributes } from "react";

interface SelectGroupProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { value: string; label: string }[];
  placeholder: string;
}

const SelectGroup: React.FC<SelectGroupProps> = ({
  label,
  placeholder,
  options,
  ...rest
}) => {
  return (
    <div>
      <p className="text-base text-gray-950 mb-1">{label}</p>
      <div className="border w-full border-gray-300 text-customGray1 bg-[#F9F9FB] rounded-lg px-3 py-[5px]  focus:border-customGold">
        <select
          {...rest}
          className="w-full focus:border-none focus:outline-none bg-transparent"
        >
          <option value="" disabled selected>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default SelectGroup;
