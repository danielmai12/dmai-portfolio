import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, style, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-[48px] rounded-md border focus:border-accent font-light px-4 py-5 text-base outline-none transition-colors",
          className
        )}
        style={{
          backgroundColor: "var(--input-bg)",
          borderColor: "var(--border-color)",
          color: "var(--text-color)",
          ...style,
        }}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
