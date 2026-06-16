"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Plus,
  Phone,
  MessageCircle,
  MoreVertical,
  Bot,
  Calendar,
  Trash2,
  Loader2,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type AgentStatus = "ACTIVE" | "INACTIVE" | "TRAINING";

interface AgentFromAPI {
  id: string;
  name: string;
  agentType: string | null;
  voiceTone: string | null;
  phoneNumber: string | null;
  status: AgentStatus;
  createdAt: string;
  _count: { conversations: number };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getAvatarGradient(nome: string): string {
  const first = nome.trim().charAt(0).toUpperCase();
  const map: Record<string, string> = {
    A: "from-violet-500 to-purple-700", B: "from-emerald-500 to-teal-600",
    C: "from-pink-500 to-rose-600", D: "from-cyan-500 to-blue-600",
    E: "from-amber-500 to-orange-600", F: "from-fuchsia-500 to-purple-600",
    G: "from-green-500 to-emerald-700", H: "from-sky-500 to-indigo-600",
    I: "from-indigo-500 to-violet-700", J: "from-yellow-500 to-amber-600",
    K: "from-teal-500 to-cyan-700", L: "from-amber-500 to-yellow-600",
    M: "from-blue-500 to-blue-700", N: "from-red-500 to-rose-700",
    O: "from-orange-500 to-red-600", P: "from-purple-500 to-violet-700",
    Q: "from-lime-500 to-green-600", R: "from-rose-500 to-pink-700",
    S: "from-violet-500 to-purple-700", T: "from-cyan-500 to-teal-700",
    U: "from-blue-400 to-indigo-600", V: "from-emerald-400 to-green-700",
    W: "from-fuchsia-400 to-pink-600", X: "from-orange-400 to-amber-700",
    Y: "from-yellow-400 to-orange-600", Z: "from-violet-400 to-blue-600",
  };
  return map[first] ?? "from-violet-500 to-blue-600";
}

function getInitials(nome: string): string {
  const parts = nome.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "AG";
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function getTypeColor(tipo: string | null): string {
  switch (tipo) {
    case "Vendas/SDR": return "bg-violet-500/20 text-violet-300";
    case "Suporte": return "bg-blue-500/20 text-blue-300";
    case "Cobranças": return "bg-amber-500/20 text-amber-300";
    case "Agendamento": return "bg-emerald-500/20 text-emerald-300";
    case "Personalizado": return "bg-pink-500/20 text-pink-300";
    default: return "bg-white/10 text-white/40";
  }
}

function daysAgo(dateStr: string): number {
  return Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000);
}

// ─── Filter tabs ──────────────────────────────────────────────────────────────

type FilterTab = "Todos" | "Ativos" | "Pausados" | "Arquivados";

const tabs: FilterTab[] = ["Todos", "Ativos", "Pausados", "Arquivados"];

function filterAgents(agents: AgentFromAPI[], tab: FilterTab) {
  if (tab === "Ativos") return agents.filter((a) => a.status === "ACTIVE");
  if (tab === "Pausados") return agents.filter((a) => a.status === "INACTIVE");
  if (tab === "Arquivados") return agents.filter((a) => a.status === "TRAINING");
  return agents;
}

// ─── Status badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: AgentStatus }) {
  if (status === "ACTIVE") {
    return (
      <div className="flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
        <span className="text-xs font-medium text-emerald-400">Ativo</span>
      </div>
    );
  }
  if (status === "TRAINING") {
    return (
      <div className="flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_6px_#60a5fa] animate-pulse" />
        <span className="text-xs font-medium text-blue-400">Treinando</span>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-1.5">
      <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_6px_#fbbf24]" />
      <span className="text-xs font-medium text-amber-400">Inativo</span>
    </div>
  );
}

// ─── Agent card ───────────────────────────────────────────────────────────────

function AgentCard({ agent, onDelete }: { agent: AgentFromAPI; onDelete: (id: string) => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const gradient = getAvatarGradient(agent.name);
  const initials = getInitials(agent.name);

  async function handleDelete() {
    if (!confirm(`Excluir o agente "${agent.name}"? Esta ação não pode ser desfeita.`)) return;
    setDeleting(true);
    await fetch(`/api/agents/${agent.id}`, { method: "DELETE" });
    onDelete(agent.id);
  }

  return (
    <div className="group bg-white/5 hover:bg-white/[0.08] border border-white/10 hover:border-white/20 backdrop-blur rounded-2xl p-4 sm:p-5 flex flex-col gap-4 transition-all duration-200 min-w-0">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center flex-shrink-0 shadow-lg`}>
            <span className="text-white text-sm font-bold">{initials}</span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white leading-tight truncate">{agent.name}</p>
            {agent.agentType && (
              <span className={`inline-block mt-1 text-[10px] font-medium px-2 py-0.5 rounded-full ${getTypeColor(agent.agentType)}`}>
                {agent.agentType}
              </span>
            )}
          </div>
        </div>

        <div className="relative flex-shrink-0">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="p-1.5 rounded-lg text-white/30 hover:text-white/70 hover:bg-white/10 transition-colors -mr-0.5 -mt-0.5"
          >
            <MoreVertical size={15} />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-8 z-20 bg-[#1a1a2e] border border-white/10 rounded-xl shadow-xl py-1 min-w-[140px]">
              <Link
                href={`/agentes/${agent.id}/editar`}
                className="flex items-center gap-2 px-3 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                Editar
              </Link>
              <button
                onClick={() => { setMenuOpen(false); handleDelete(); }}
                disabled={deleting}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
              >
                <Trash2 size={13} />
                {deleting ? "Excluindo…" : "Excluir"}
              </button>
            </div>
          )}
        </div>
      </div>

      <StatusBadge status={agent.status} />

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-white/40">
        <div className="flex items-center gap-1.5">
          <MessageCircle size={12} className="text-white/30 flex-shrink-0" />
          <span>
            <span className="text-white/70 font-medium">
              {agent._count.conversations.toLocaleString("pt-BR")}
            </span>{" "}
            conversas
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <Calendar size={12} className="text-white/30" />
          <span>
            {daysAgo(agent.createdAt) === 0 ? "Hoje" : `Há ${daysAgo(agent.createdAt)} dias`}
          </span>
        </div>
      </div>

      {agent.phoneNumber && (
        <div className="flex items-center gap-2 py-2.5 px-3 rounded-xl bg-white/[0.04] border border-white/[0.06]">
          <Phone size={13} className="text-emerald-400 flex-shrink-0" />
          <span className="text-xs text-white/60 font-mono">{agent.phoneNumber}</span>
        </div>
      )}

      <div className="flex items-center gap-2 pt-0.5">
        <Link
          href={`/agentes/${agent.id}/editar`}
          className="flex-1 text-center text-xs font-medium text-white/60 hover:text-white py-2 px-3 rounded-xl hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-150"
        >
          Editar
        </Link>
        <Link
          href={`/conversas?agente=${agent.id}`}
          className="flex-1 text-center text-xs font-medium text-violet-400 hover:text-violet-300 py-2 px-3 rounded-xl border border-violet-500/30 hover:border-violet-500/60 hover:bg-violet-500/10 transition-all duration-150"
        >
          Ver conversas
        </Link>
      </div>
    </div>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState({ tab }: { tab: FilterTab }) {
  const messages: Record<FilterTab, { title: string; desc: string }> = {
    Todos: { title: "Nenhum agente criado ainda", desc: "Crie seu primeiro agente de IA para começar a atender clientes no WhatsApp." },
    Ativos: { title: "Nenhum agente ativo", desc: "Ative um agente existente ou crie um novo." },
    Pausados: { title: "Nenhum agente inativo", desc: "Agentes inativos aparecerão aqui." },
    Arquivados: { title: "Nenhum agente em treinamento", desc: "Agentes em treinamento aparecerão aqui." },
  };
  const { title, desc } = messages[tab];
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-5">
        <Bot size={36} className="text-white/20" />
      </div>
      <h3 className="text-base font-semibold text-white mb-2">{title}</h3>
      <p className="text-sm text-white/40 max-w-xs mb-6">{desc}</p>
      {(tab === "Todos" || tab === "Ativos") && (
        <Link
          href="/agentes/novo"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 transition-all duration-200 shadow-lg shadow-violet-900/30"
        >
          <Plus size={15} />
          Criar primeiro agente
        </Link>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AgentesPage() {
  const [activeTab, setActiveTab] = useState<FilterTab>("Todos");
  const [agents, setAgents] = useState<AgentFromAPI[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/agents")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setAgents(data);
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = filterAgents(agents, activeTab);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1400px]">

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Meus Agentes</h1>
          <p className="text-sm text-white/40 mt-1">Gerencie e monitore seus agentes de IA</p>
        </div>
        <Link
          href="/agentes/novo"
          className="inline-flex w-full sm:w-auto items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 transition-all duration-200 shadow-lg shadow-violet-900/30"
        >
          <Plus size={15} />
          Novo Agente
        </Link>
      </div>

      <div className="-mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto">
        <div className="inline-flex items-center gap-1 p-1 bg-white/5 border border-white/10 rounded-xl">
          {tabs.map((tab) => {
            const count = filterAgents(agents, tab).length;
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex items-center gap-2 shrink-0 whitespace-nowrap px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive ? "bg-white/10 text-white shadow-sm" : "text-white/45 hover:text-white/70 hover:bg-white/5"
                }`}
              >
                {tab}
                <span className={`text-[11px] font-semibold px-1.5 py-0.5 rounded-full leading-none ${isActive ? "bg-violet-500/30 text-violet-300" : "bg-white/10 text-white/40"}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={28} className="animate-spin text-violet-400" />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState tab={activeTab} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((agent) => (
            <AgentCard
              key={agent.id}
              agent={agent}
              onDelete={(id) => setAgents((prev) => prev.filter((a) => a.id !== id))}
            />
          ))}
        </div>
      )}

    </div>
  );
}
