import { cn } from "@/shared/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";
import Link from "next/link";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "blue" | "gray-50" | "link";
  size?: "sm" | "md" | "lg";
  href?: string;
  target?: string;
  disabled?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "blue",
      size = "md",
      children,
      href,
      target,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseClasses =
      "font-semibold cursor-pointer rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";

    const variants = {
      blue: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
      "gray-50":
        "bg-gray-50 text-gray-900 hover:bg-gray-100 focus:ring-gray-500 border border-gray-200",
      link: "!p-0 bg-transparent text-blue-600 hover:text-blue-700 focus:ring-blue-500",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2 text-md",
      lg: "px-5 py-2 text-lg",
    };

    const buttonClasses = cn(
      baseClasses,
      variants[variant],
      sizes[size],
      className
    );

    if (href) {
      return (
        <Link target={target} href={href} className={buttonClasses}>
          {children}
        </Link>
      );
    }

    return (
      <button
        className={cn(
          buttonClasses,
          disabled &&
            "opacity-50 hover:bg-gray-300 cursor-not-allowed bg-gray-300"
        )}
        ref={ref}
        {...props}
        disabled={disabled}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
