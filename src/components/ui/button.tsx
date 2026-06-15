"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2",
    "font-medium text-sm leading-none whitespace-nowrap",
    "rounded-xl select-none cursor-pointer",
    "transition-all duration-200",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500",
    "disabled:opacity-50 disabled:pointer-events-none",
    "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        default: [
          "bg-gradient-to-r from-violet-600 to-blue-600",
          "hover:from-violet-500 hover:to-blue-500",
          "text-white shadow-lg shadow-violet-500/25",
          "active:scale-[0.98]",
        ],
        secondary: [
          "bg-white/10 hover:bg-white/15",
          "text-white border border-white/10",
          "active:scale-[0.98]",
        ],
        outline: [
          "border border-violet-500/50 hover:border-violet-400",
          "text-violet-400 hover:text-violet-300",
          "hover:bg-violet-500/10",
          "active:scale-[0.98]",
        ],
        ghost: [
          "hover:bg-white/10 text-slate-400 hover:text-white",
          "active:scale-[0.98]",
        ],
        destructive: [
          "bg-red-600/90 hover:bg-red-600 text-white",
          "active:scale-[0.98]",
        ],
      },
      size: {
        sm:      "h-8  px-3   text-xs  rounded-lg",
        default: "h-10 px-4   text-sm",
        lg:      "h-11 px-6   text-base",
        icon:    "size-10 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size:    "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading = false, disabled, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"

    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <>
            <svg
              className="animate-spin size-4 shrink-0"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span className="sr-only">Loading</span>
            {children}
          </>
        ) : (
          children
        )}
      </Comp>
    )
  }
)

Button.displayName = "Button"

export { Button, buttonVariants }
