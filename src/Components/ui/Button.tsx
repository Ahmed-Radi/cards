import React from "react";

interface IButton extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  className?: string;
  width?: "w-full" | "w-fit";
}

const Button = ({ children, className, width="w-full", ...rest }: IButton) => {
  return (
    <button className={`${className} ${width} rounded-lg text-white px-3 py-3 duration-200 font-medium`} {...rest}>
      {children}
    </button>
  )
}


export default Button;