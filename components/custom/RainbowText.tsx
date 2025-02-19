import React from "react";
import { cn } from "@/lib/utils";

interface RainbowTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
}

export const RainbowText = React.forwardRef<HTMLSpanElement, RainbowTextProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          "inline-block bg-clip-text text-transparent bg-[length:200%] animate-rainbow",
          "bg-gradient-to-r from-red-500 via-orange-500 via-yellow-500 via-green-500 via-blue-500 via-indigo-500 to-violet-500",
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);

RainbowText.displayName = "RainbowText";