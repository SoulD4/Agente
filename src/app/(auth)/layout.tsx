import type { ReactNode } from "react";
import { Logo } from "@/components/brand/logo";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4 py-12 overflow-hidden">
      {/* Purple orb top-right */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(139,92,246,0.18) 0%, rgba(139,92,246,0.06) 40%, transparent 70%)",
        }}
      />

      {/* Subtle grid pattern */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Logo link top-left */}
      <div className="absolute left-6 top-6 z-10">
        <Logo size={32} />
      </div>

      {/* Page content */}
      <div className="relative z-10 w-full">{children}</div>
    </div>
  );
}
