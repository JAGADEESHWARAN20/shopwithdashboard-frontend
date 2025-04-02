import { cn } from "@/lib/utils";
import { forwardRef } from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
     variant?: "default" | "outline" | "secondary"; // Define accepted variants
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
     ({ className, children, disabled, type = "button", variant = "default", ...props }, ref) => {
          return (
               <button
                    className={cn(
                         "w-auto rounded-full px-5 py-3 disabled:cursor-not-allowed disabled:opacity-50 font-semibold transition-all",
                         variant === "default" && "bg-black text-white",
                         variant === "outline" && "border border-black text-black bg-transparent",
                         variant === "secondary" && "bg-gray-200 text-black",
                         className
                    )}
                    ref={ref}
                    disabled={disabled}
                    type={type}
                    {...props}
               >
                    {children}
               </button>
          );
     }
);

Button.displayName = "Button";

export default Button;
