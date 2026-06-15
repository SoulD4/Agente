"use client";

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
} from "lucide-react";

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

  const pageTitle =
    pageTitles[pathname] ??
    pageTitles[
      Object.keys(pageTitles).find((k) => pathname.startsWith(k)) ?? ""
    ] ??
    "Dashboard";

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-[260px] bg-[#111118] border-r border-white/5 flex flex-col z-50">
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-white/5">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center flex-shrink-0 shadow-lg shadow-purple-900/40">
            <span className="text-white font-bold text-base leading-none">Z</span>
          </div>
          <span className="text-lg font-bold bg-gradient-to-r from-purple-400 to-purple-200 bg-clip-text text-transparent tracking-tight">
            Zaia
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          <ul className="space-y-0.5">
            {navItems.map(({ label, href, icon: Icon }) => {
              const isActive = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group relative
                      ${
                        isActive
                          ? "bg-purple-600/20 text-purple-400 border-r-2 border-purple-500"
                          : "text-white/50 hover:bg-white/5 hover:text-white/80"
                      }`}
                  >
                    <Icon
                      size={17}
                      className={`flex-shrink-0 transition-colors ${
                        isActive ? "text-purple-400" : "text-white/40 group-hover:text-white/60"
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
        <div className="px-4 py-4 border-t border-white/5">
          <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-white/5 transition-colors cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-semibold">JS</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white leading-tight truncate">João Silva</p>
              <p className="text-xs text-white/40 leading-tight">Admin</p>
            </div>
            <ChevronDown size={14} className="text-white/30 flex-shrink-0" />
          </div>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 ml-[260px] flex flex-col min-h-screen">
        {/* Top header */}
        <header className="sticky top-0 z-40 bg-[#0a0a0f]/90 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-8 py-4">
          <h1 className="text-lg font-semibold text-white">{pageTitle}</h1>
          <div className="flex items-center gap-4">
            {/* Notifications */}
            <button className="relative p-2 rounded-xl hover:bg-white/5 transition-colors text-white/50 hover:text-white/80">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 rounded-full text-[9px] font-bold text-white flex items-center justify-center leading-none">
                3
              </span>
            </button>
            {/* User avatar */}
            <button className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl hover:bg-white/5 transition-colors">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center">
                <span className="text-white text-xs font-semibold">JS</span>
              </div>
              <ChevronDown size={13} className="text-white/40" />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-[#0a0a0f]">
          {children}
        </main>
      </div>
    </div>
  );
}
