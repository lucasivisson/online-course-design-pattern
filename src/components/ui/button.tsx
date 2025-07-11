import { cn } from "@/shared/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "blue" | "gray-50";
  size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "blue", size = "md", children, ...props }, ref) => {
    const baseClasses =
      "font-semibold cursor-pointer rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";

    const variants = {
      blue: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
      "gray-50":
        "bg-gray-50 text-gray-900 hover:bg-gray-100 focus:ring-gray-500 border border-gray-200",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2 text-md",
      lg: "px-6 py-3 text-lg",
    };

    return (
      <button
        className={cn(baseClasses, variants[variant], sizes[size], className)}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
