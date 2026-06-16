"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Bot,
  Brain,
  MessageCircle,
  MessagesSquare,
  BarChart3,
  Settings,
  Shield,
  Bell,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";
import { Logo } from "@/components/brand/logo";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: Home },
  { label: "Agentes", href: "/agentes", icon: Bot },
  { label: "Treinamento", href: "/treinamento", icon: Brain },
  { label: "WhatsApp", href: "/whatsapp", icon: MessageCircle },
  { label: "Conversas", href: "/conversas", icon: MessagesSquare },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
  { label: "Configurações", href: "/configuracoes", icon: Settings },
  { label: "Admin", href: "/admin", icon: Shield },
];

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/agentes": "Agentes",
  "/treinamento": "Treinamento",
  "/whatsapp": "WhatsApp",
  "/conversas": "Conversas",
  "/analytics": "Analytics",
  "/configuracoes": "Configurações",
  "/admin": "Admin",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close the drawer whenever the route changes.
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Lock body scroll while the mobile drawer is open.
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const pageTitle =
    pageTitles[pathname] ??
    pageTitles[
      Object.keys(pageTitles).find((k) => pathname.startsWith(k)) ?? ""
    ] ??
    "Dashboard";

  const SidebarContent = (
    <>
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b border-white/5 px-5">
        <Logo size={32} />
        <button
          onClick={() => setMobileOpen(false)}
          className="rounded-lg p-1.5 text-white/50 hover:bg-white/5 hover:text-white lg:hidden"
          aria-label="Fechar menu"
        >
          <X size={18} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-0.5">
          {navItems.map(({ label, href, icon: Icon }) => {
            const isActive =
              pathname === href ||
              (href !== "/dashboard" && pathname.startsWith(href));
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150
                    ${
                      isActive
                        ? "bg-violet-600/20 text-violet-300"
                        : "text-white/50 hover:bg-white/5 hover:text-white/80"
                    }`}
                >
                  {isActive && (
                    <span className="absolute inset-y-1.5 left-0 w-0.5 rounded-full bg-violet-500" />
                  )}
                  <Icon
                    size={18}
                    className={`shrink-0 transition-colors ${
                      isActive
                        ? "text-violet-300"
                        : "text-white/40 group-hover:text-white/60"
                    }`}
                  />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User profile */}
      <div className="border-t border-white/5 px-4 py-4">
        <button className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left transition-colors hover:bg-white/5">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-blue-600">
            <span className="text-xs font-semibold text-white">JS</span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium leading-tight text-white">
              João Silva
            </p>
            <p className="text-xs leading-tight text-white/40">Admin</p>
          </div>
          <ChevronDown size={14} className="shrink-0 text-white/30" />
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Desktop sidebar (fixed) */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[260px] flex-col border-r border-white/5 bg-[#111118] lg:flex">
        {SidebarContent}
      </aside>

      {/* Mobile drawer + overlay */}
      <div
        className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity lg:hidden ${
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setMobileOpen(false)}
        aria-hidden={!mobileOpen}
      />
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[80%] max-w-[300px] flex-col border-r border-white/5 bg-[#111118] transition-transform duration-300 ease-out lg:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {SidebarContent}
      </aside>

      {/* Main area */}
      <div className="flex min-h-screen flex-col lg:ml-[260px]">
        {/* Top header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-white/5 bg-[#0a0a0f]/90 px-4 backdrop-blur-md sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="rounded-xl p-2 text-white/60 transition-colors hover:bg-white/5 hover:text-white lg:hidden"
              aria-label="Abrir menu"
            >
              <Menu size={20} />
            </button>
            <h1 className="text-base font-semibold text-white sm:text-lg">
              {pageTitle}
            </h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <button className="relative rounded-xl p-2 text-white/50 transition-colors hover:bg-white/5 hover:text-white/80">
              <Bell size={18} />
              <span className="absolute right-1.5 top-1.5 flex size-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold leading-none text-white">
                3
              </span>
            </button>
            <button className="flex items-center gap-2 rounded-xl py-1 pl-1 pr-2 transition-colors hover:bg-white/5">
              <div className="flex size-7 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-blue-600">
                <span className="text-xs font-semibold text-white">JS</span>
              </div>
              <ChevronDown size={13} className="hidden text-white/40 sm:block" />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
}
