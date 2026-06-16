"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Plus,
  Phone,
  MessageCircle,
  MoreVertical,
  Bot,
  Calendar,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type AgentStatus = "Ativo" | "Pausado" | "Arquivado";

interface Agent {
  id: number;
  name: string;
  initials: string;
  avatarGradient: string;
  type: string;
  typeColor: string;
  status: AgentStatus;
  phone: string;
  conversations: number;
  createdDaysAgo: number;
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const agents: Agent[] = [
  {
    id: 1,
    name: "Sofia",
    initials: "SO",
    avatarGradient: "from-violet-500 to-purple-700",
    type: "Vendas",
    typeColor: "bg-violet-500/20 text-violet-300",
    status: "Ativo",
    phone: "(11) 9999-0001",
    conversations: 847,
    createdDaysAgo: 23,
  },
  {
    id: 2,
    name: "Max",
    initials: "MX",
    avatarGradient: "from-blue-500 to-blue-700",
    type: "Suporte",
    typeColor: "bg-blue-500/20 text-blue-300",
    status: "Ativo",
    phone: "(11) 9999-0002",
    conversations: 1203,
    createdDaysAgo: 45,
  },
  {
    id: 3,
    name: "Luna",
    initials: "LU",
    avatarGradient: "from-amber-500 to-orange-600",
    type: "Cobranças",
    typeColor: "bg-amber-500/20 text-amber-300",
    status: "Pausado",
    phone: "(11) 9999-0003",
    conversations: 342,
    createdDaysAgo: 12,
  },
  {
    id: 4,
    name: "Bruno",
    initials: "BR",
    avatarGradient: "from-emerald-500 to-teal-600",
    type: "Agendamento",
    typeColor: "bg-emerald-500/20 text-emerald-300",
    status: "Ativo",
    phone: "(11) 9999-0004",
    conversations: 156,
    createdDaysAgo: 5,
  },
];

// ─── Filter tabs ──────────────────────────────────────────────────────────────

type FilterTab = "Todos" | "Ativos" | "Pausados" | "Arquivados";

const tabs: FilterTab[] = ["Todos", "Ativos", "Pausados", "Arquivados"];

function getTabCount(tab: FilterTab): number {
  if (tab === "Todos") return agents.length;
  if (tab === "Ativos") return agents.filter((a) => a.status === "Ativo").length;
  if (tab === "Pausados") return agents.filter((a) => a.status === "Pausado").length;
  if (tab === "Arquivados") return agents.filter((a) => a.status === "Arquivado").length;
  return 0;
}

function filterAgents(tab: FilterTab): Agent[] {
  if (tab === "Todos") return agents;
  if (tab === "Ativos") return agents.filter((a) => a.status === "Ativo");
  if (tab === "Pausados") return agents.filter((a) => a.status === "Pausado");
  if (tab === "Arquivados") return agents.filter((a) => a.status === "Arquivado");
  return [];
}

// ─── Status badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: AgentStatus }) {
  if (status === "Ativo") {
    return (
      <div className="flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
        <span className="text-xs font-medium text-emerald-400">Ativo</span>
      </div>
    );
  }
  if (status === "Pausado") {
    return (
      <div className="flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_6px_#fbbf24]" />
        <span className="text-xs font-medium text-amber-400">Pausado</span>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-1.5">
      <span className="w-2 h-2 rounded-full bg-white/25" />
      <span className="text-xs font-medium text-white/40">Arquivado</span>
    </div>
  );
}

// ─── Agent card ───────────────────────────────────────────────────────────────

function AgentCard({ agent }: { agent: Agent }) {
  return (
    <div className="group bg-white/5 hover:bg-white/[0.08] border border-white/10 hover:border-white/20 backdrop-blur rounded-2xl p-4 sm:p-5 flex flex-col gap-4 transition-all duration-200 min-w-0">
      {/* Top row: avatar + name + type + menu */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          {/* Avatar */}
          <div
            className={`w-11 h-11 rounded-full bg-gradient-to-br ${agent.avatarGradient} flex items-center justify-center flex-shrink-0 shadow-lg`}
          >
            <span className="text-white text-sm font-bold">{agent.initials}</span>
          </div>
          {/* Name + type */}
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white leading-tight truncate">{agent.name}</p>
            <span
              className={`inline-block mt-1 text-[10px] font-medium px-2 py-0.5 rounded-full ${agent.typeColor}`}
            >
              {agent.type}
            </span>
          </div>
        </div>
        {/* 3-dot menu */}
        <button className="p-1.5 rounded-lg text-white/30 hover:text-white/70 hover:bg-white/10 transition-colors -mr-0.5 -mt-0.5 flex-shrink-0">
          <MoreVertical size={15} />
        </button>
      </div>

      {/* Status */}
      <StatusBadge status={agent.status} />

      {/* Stats row */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-white/40">
        <div className="flex items-center gap-1.5">
          <MessageCircle size={12} className="text-white/30 flex-shrink-0" />
          <span>
            <span className="text-white/70 font-medium">
              {agent.conversations.toLocaleString("pt-BR")}
            </span>{" "}
            conversas
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <Calendar size={12} className="text-white/30" />
          <span>Há {agent.createdDaysAgo} dias</span>
        </div>
      </div>

      {/* WhatsApp number */}
      <div className="flex items-center gap-2 py-2.5 px-3 rounded-xl bg-white/[0.04] border border-white/[0.06]">
        <Phone size={13} className="text-emerald-400 flex-shrink-0" />
        <span className="text-xs text-white/60 font-mono">{agent.phone}</span>
      </div>

      {/* Action buttons */}
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
    Todos: {
      title: "Nenhum agente criado ainda",
      desc: "Crie seu primeiro agente de IA para começar a atender clientes no WhatsApp.",
    },
    Ativos: {
      title: "Nenhum agente ativo",
      desc: "Ative um agente existente ou crie um novo para começar a atender.",
    },
    Pausados: {
      title: "Nenhum agente pausado",
      desc: "Agentes pausados aparecerão aqui quando você pausar algum.",
    },
    Arquivados: {
      title: "Nenhum agente arquivado",
      desc: "Agentes arquivados aparecerão aqui.",
    },
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

  const filtered = filterAgents(activeTab);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1400px]">

      {/* ── Header row ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Meus Agentes</h1>
          <p className="text-sm text-white/40 mt-1">
            Gerencie e monitore seus agentes de IA
          </p>
        </div>
        <Link
          href="/agentes/novo"
          className="inline-flex w-full sm:w-auto items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 transition-all duration-200 shadow-lg shadow-violet-900/30"
        >
          <Plus size={15} />
          Novo Agente
        </Link>
      </div>

      {/* ── Filter tabs ── */}
      <div className="-mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto">
        <div className="inline-flex items-center gap-1 p-1 bg-white/5 border border-white/10 rounded-xl">
          {tabs.map((tab) => {
            const count = getTabCount(tab);
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex items-center gap-2 shrink-0 whitespace-nowrap px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? "bg-white/10 text-white shadow-sm"
                    : "text-white/45 hover:text-white/70 hover:bg-white/5"
                }`}
              >
                {tab}
                <span
                  className={`text-[11px] font-semibold px-1.5 py-0.5 rounded-full leading-none ${
                    isActive
                      ? "bg-violet-500/30 text-violet-300"
                      : "bg-white/10 text-white/40"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Agent grid or empty state ── */}
      {filtered.length === 0 ? (
        <EmptyState tab={activeTab} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((agent) => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>
      )}

    </div>
  );
}
