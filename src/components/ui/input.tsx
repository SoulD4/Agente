import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "w-full text-sm",
          "bg-white/5 border border-white/10 rounded-xl px-4 py-2.5",
          "text-white placeholder:text-slate-500",
          "hover:border-white/20",
          "focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50",
          "transition-all duration-200",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-white",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)

Input.displayName = "Input"

export { Input }
