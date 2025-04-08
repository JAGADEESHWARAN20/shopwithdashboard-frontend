import { cn } from "@/lib/utils";
import { forwardRef } from "react";
import * as React from "react"; // Import the entire React namespace

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
     variant?: "default" | "outline" | "secondary" | "destructive" | "link" | "icon";
     size?: "default" | "sm" | "lg" | "icon";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
     ({ className, children, disabled, type = "button", variant = "default", size = "default", ...props }, ref) => {
          const variantClasses = cn(
               variant === "default" && "bg-black text-white hover:bg-gray-800",
               variant === "outline" && "border border-gray-200 bg-transparent hover:bg-gray-100 text-gray-900",
               variant === "secondary" && "bg-gray-100 hover:bg-gray-200 text-gray-900",
               variant === "destructive" && "bg-red-500 hover:bg-red-600 text-white",
               variant === "link" && "text-blue-500 underline-offset-2 hover:underline",
               variant === "icon" && "h-9 w-9", // Adjust size as needed
          );

          const sizeClasses = cn(
               size === "default" && "px-5 py-3 text-sm font-medium",
               size === "sm" && "px-3 py-2 text-xs",
               size === "lg" && "px-6 py-3 text-base",
               size === "icon" && "p-0 rounded-full",
          );

          return (
               <button
                    className={cn(
                         "w-auto rounded-full disabled:cursor-not-allowed disabled:opacity-50 transition-all",
                         variantClasses,
                         sizeClasses,
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