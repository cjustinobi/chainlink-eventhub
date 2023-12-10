import React, { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  className?: string;
  disabled?: boolean;
};

const Button: React.FC<ButtonProps> = ({
  children,
  className,
  disabled,
  ...rest
}) => {
  const defaultClassName =
    "rounded-lg flex items-center justify-center hover:opacity-80 w-full font-bold py-3 px-6 bg-customGold";
  const finalClassName = className
    ? `${defaultClassName} ${className}`
    : defaultClassName;

  return (
    <button
      {...rest}
      className={finalClassName}
      disabled={disabled}
      style={{ cursor: disabled ? "not-allowed" : "pointer" }}
    >
      {children}
    </button>
  );
};

export default Button;
