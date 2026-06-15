import type { ReactNode } from "react";
import Link from "next/link";

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
      <Link
        href="/"
        className="absolute top-6 left-6 flex items-center gap-2.5 group"
      >
        <div className="grid size-8 place-items-center rounded-lg bg-gradient-to-br from-violet-500 to-blue-600 font-bold text-white text-sm shadow-lg shadow-violet-500/30 transition-shadow group-hover:shadow-violet-500/50">
          Z
        </div>
        <span className="text-base font-semibold tracking-tight text-white opacity-80 group-hover:opacity-100 transition-opacity">
          Zaia
        </span>
      </Link>

      {/* Page content */}
      <div className="relative z-10 w-full">{children}</div>
    </div>
  );
}
