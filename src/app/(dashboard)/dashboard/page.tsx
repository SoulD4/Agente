"use client";

import Link from "next/link";
import {
  MessageCircle,
  Users,
  Zap,
  CalendarClock,
  TrendingUp,
  ArrowRight,
  Bot,
  Brain,
  Wifi,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// ─── Mock data ────────────────────────────────────────────────────────────────

const conversationData = [
  { dia: "Seg", conversas: 180 },
  { dia: "Ter", conversas: 220 },
  { dia: "Qua", conversas: 195 },
  { dia: "Qui", conversas: 260 },
  { dia: "Sex", conversas: 310 },
  { dia: "Sáb", conversas: 175 },
  { dia: "Dom", conversas: 247 },
];

const agentPieData = [
  { name: "Sofia Vendas", value: 112, color: "#a78bfa" },
  { name: "Max Suporte", value: 78, color: "#60a5fa" },
  { name: "Luna Cobranças", value: 42, color: "#34d399" },
  { name: "Outros", value: 15, color: "#fbbf24" },
];

const recentConversations = [
  {
    id: 1,
    name: "Mariana Costa",
    initials: "MC",
    color: "bg-violet-500",
    preview: "Gostaria de saber mais sobre os planos disponíveis...",
    time: "agora",
    status: "Ativa",
  },
  {
    id: 2,
    name: "Rafael Souza",
    initials: "RS",
    color: "bg-blue-500",
    preview: "Meu boleto venceu ontem, como faço para pagar?",
    time: "2 min",
    status: "Aguardando",
  },
  {
    id: 3,
    name: "Fernanda Lima",
    initials: "FL",
    color: "bg-emerald-500",
    preview: "Perfeito, muito obrigada pelo atendimento!",
    time: "14 min",
    status: "Finalizada",
  },
  {
    id: 4,
    name: "Bruno Alves",
    initials: "BA",
    color: "bg-amber-500",
    preview: "Quero remarcar meu agendamento para sexta-feira.",
    time: "31 min",
    status: "Ativa",
  },
  {
    id: 5,
    name: "Camila Nunes",
    initials: "CN",
    color: "bg-pink-500",
    preview: "Recebi um produto diferente do que pedi...",
    time: "1h",
    status: "Aguardando",
  },
];

const activeAgents = [
  {
    id: 1,
    name: "Sofia Vendas",
    type: "Vendas",
    typeColor: "bg-violet-500/20 text-violet-300",
    number: "+55 11 99001-0001",
    conversations: 112,
  },
  {
    id: 2,
    name: "Max Suporte",
    type: "Suporte",
    typeColor: "bg-blue-500/20 text-blue-300",
    number: "+55 11 99001-0002",
    conversations: 78,
  },
  {
    id: 3,
    name: "Luna Cobranças",
    type: "Cobrança",
    typeColor: "bg-emerald-500/20 text-emerald-300",
    number: "+55 11 99001-0003",
    conversations: 42,
  },
];

const statusBadge: Record<string, string> = {
  Ativa: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
  Aguardando: "bg-amber-500/15 text-amber-400 border border-amber-500/30",
  Finalizada: "bg-white/5 text-white/40 border border-white/10",
};

// ─── Stat Card ────────────────────────────────────────────────────────────────

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
}

function StatCard({ title, value, change, icon: Icon, iconBg, iconColor }: StatCardProps) {
  return (
    <div className="bg-white/5 border border-white/10 backdrop-blur rounded-2xl p-5 flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center`}>
          <Icon size={18} className={iconColor} />
        </div>
        <span className="flex items-center gap-1 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-2 py-0.5">
          <TrendingUp size={10} />
          {change}
        </span>
      </div>
      <div>
        <p className="text-xs text-slate-400 mb-1">{title}</p>
        <p className="text-2xl font-bold text-white tracking-tight">{value}</p>
      </div>
    </div>
  );
}

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

function CustomLineTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1a1a2e] border border-white/10 rounded-xl px-3 py-2 shadow-xl">
        <p className="text-xs text-white/50 mb-0.5">{label}</p>
        <p className="text-sm font-semibold text-violet-300">{payload[0].value} conversas</p>
      </div>
    );
  }
  return null;
}

// ─── Custom Pie Legend ────────────────────────────────────────────────────────

function PieLegend() {
  return (
    <div className="mt-4 space-y-2">
      {agentPieData.map((entry) => (
        <div key={entry.name} className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-xs text-white/60 truncate max-w-[110px]">{entry.name}</span>
          </div>
          <span className="text-xs font-semibold text-white/80">{entry.value}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  return (
    <div className="p-8 space-y-8 max-w-[1400px]">

      {/* ── 1. Stats row ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Conversas hoje"
          value="247"
          change="+12% vs ontem"
          icon={MessageCircle}
          iconBg="bg-violet-500/15"
          iconColor="text-violet-400"
        />
        <StatCard
          title="Leads capturados"
          value="38"
          change="+8%"
          icon={Users}
          iconBg="bg-blue-500/15"
          iconColor="text-blue-400"
        />
        <StatCard
          title="Taxa de resposta"
          value="98.3%"
          change="+0.5%"
          icon={Zap}
          iconBg="bg-emerald-500/15"
          iconColor="text-emerald-400"
        />
        <StatCard
          title="Agendamentos"
          value="12"
          change="+3%"
          icon={CalendarClock}
          iconBg="bg-amber-500/15"
          iconColor="text-amber-400"
        />
      </div>

      {/* ── 2. Charts row ── */}
      <div className="grid grid-cols-3 gap-4">

        {/* Line chart — 2/3 */}
        <div className="col-span-3 lg:col-span-2 bg-white/5 border border-white/10 backdrop-blur rounded-2xl p-5">
          <div className="mb-5">
            <h2 className="text-sm font-semibold text-white">Conversas nos últimos 7 dias</h2>
            <p className="text-xs text-slate-500 mt-0.5">Volume diário de conversas iniciadas</p>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={conversationData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis
                dataKey="dia"
                tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomLineTooltip />} cursor={{ stroke: "rgba(167,139,250,0.15)", strokeWidth: 1 }} />
              <Line
                type="monotone"
                dataKey="conversas"
                stroke="#a78bfa"
                strokeWidth={2.5}
                dot={{ fill: "#a78bfa", r: 3.5, strokeWidth: 0 }}
                activeDot={{ r: 5, fill: "#c4b5fd", strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pie chart — 1/3 */}
        <div className="col-span-3 lg:col-span-1 bg-white/5 border border-white/10 backdrop-blur rounded-2xl p-5">
          <div className="mb-3">
            <h2 className="text-sm font-semibold text-white">Conversas por agente</h2>
            <p className="text-xs text-slate-500 mt-0.5">Distribuição hoje</p>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie
                data={agentPieData}
                cx="50%"
                cy="50%"
                innerRadius={48}
                outerRadius={72}
                paddingAngle={3}
                dataKey="value"
                strokeWidth={0}
              >
                {agentPieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <PieLegend />
        </div>
      </div>

      {/* ── 3. Two-column grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Recent conversations */}
        <div className="bg-white/5 border border-white/10 backdrop-blur rounded-2xl p-5 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-white">Conversas recentes</h2>
            <Link
              href="/conversas"
              className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1 transition-colors"
            >
              Ver todas <ArrowRight size={12} />
            </Link>
          </div>

          <div className="space-y-1 flex-1">
            {recentConversations.map((conv) => (
              <div
                key={conv.id}
                className="flex items-center gap-3 py-2.5 px-2 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group"
              >
                {/* Avatar */}
                <div
                  className={`w-9 h-9 rounded-full ${conv.color} flex items-center justify-center flex-shrink-0`}
                >
                  <span className="text-white text-xs font-semibold">{conv.initials}</span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-sm font-medium text-white truncate pr-2">{conv.name}</span>
                    <span className="text-[11px] text-white/35 flex-shrink-0">{conv.time}</span>
                  </div>
                  <p className="text-xs text-white/40 truncate">{conv.preview}</p>
                </div>

                {/* Status */}
                <span
                  className={`text-[10px] font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${statusBadge[conv.status]}`}
                >
                  {conv.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Active agents */}
        <div className="bg-white/5 border border-white/10 backdrop-blur rounded-2xl p-5 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-white">Agentes ativos</h2>
            <Link
              href="/agentes"
              className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1 transition-colors"
            >
              Gerenciar <ArrowRight size={12} />
            </Link>
          </div>

          <div className="space-y-3 flex-1">
            {activeAgents.map((agent) => (
              <div
                key={agent.id}
                className="flex items-center gap-3 py-3 px-3 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] transition-colors"
              >
                {/* Icon */}
                <div className="w-9 h-9 rounded-xl bg-violet-500/15 flex items-center justify-center flex-shrink-0">
                  <Bot size={16} className="text-violet-400" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-medium text-white">{agent.name}</span>
                    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${agent.typeColor}`}>
                      {agent.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Wifi size={10} className="text-white/30" />
                    <span className="text-xs text-white/40">{agent.number}</span>
                  </div>
                </div>

                {/* Status + count */}
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
                    <span className="text-[11px] text-emerald-400 font-medium">Online</span>
                  </div>
                  <span className="text-xs text-white/40">{agent.conversations} conv.</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 4. Quick start ── */}
      <div>
        <div className="mb-4">
          <h2 className="text-sm font-semibold text-white">Início rápido</h2>
          <p className="text-xs text-slate-500 mt-0.5">Configure sua plataforma em poucos passos</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1 */}
          <Link
            href="/agentes/novo"
            className="group bg-white/5 border border-white/10 hover:border-violet-500/40 hover:bg-violet-500/5 backdrop-blur rounded-2xl p-5 transition-all duration-200 flex items-start gap-4"
          >
            <div className="w-10 h-10 rounded-xl bg-violet-500/15 group-hover:bg-violet-500/25 flex items-center justify-center flex-shrink-0 transition-colors">
              <Bot size={18} className="text-violet-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white mb-1 group-hover:text-violet-300 transition-colors">
                Criar primeiro agente
              </p>
              <p className="text-xs text-white/40 leading-relaxed">
                Configure um agente de IA para atender seus clientes no WhatsApp.
              </p>
            </div>
            <ArrowRight
              size={16}
              className="text-white/20 group-hover:text-violet-400 flex-shrink-0 mt-0.5 transition-colors"
            />
          </Link>

          {/* Card 2 */}
          <Link
            href="/treinamento"
            className="group bg-white/5 border border-white/10 hover:border-blue-500/40 hover:bg-blue-500/5 backdrop-blur rounded-2xl p-5 transition-all duration-200 flex items-start gap-4"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-500/15 group-hover:bg-blue-500/25 flex items-center justify-center flex-shrink-0 transition-colors">
              <Brain size={18} className="text-blue-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white mb-1 group-hover:text-blue-300 transition-colors">
                Treinar base de conhecimento
              </p>
              <p className="text-xs text-white/40 leading-relaxed">
                Adicione documentos e FAQs para deixar seus agentes mais inteligentes.
              </p>
            </div>
            <ArrowRight
              size={16}
              className="text-white/20 group-hover:text-blue-400 flex-shrink-0 mt-0.5 transition-colors"
            />
          </Link>

          {/* Card 3 */}
          <Link
            href="/whatsapp"
            className="group bg-white/5 border border-white/10 hover:border-emerald-500/40 hover:bg-emerald-500/5 backdrop-blur rounded-2xl p-5 transition-all duration-200 flex items-start gap-4"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 group-hover:bg-emerald-500/25 flex items-center justify-center flex-shrink-0 transition-colors">
              <MessageCircle size={18} className="text-emerald-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white mb-1 group-hover:text-emerald-300 transition-colors">
                Conectar WhatsApp
              </p>
              <p className="text-xs text-white/40 leading-relaxed">
                Vincule seu número e comece a receber e enviar mensagens automaticamente.
              </p>
            </div>
            <ArrowRight
              size={16}
              className="text-white/20 group-hover:text-emerald-400 flex-shrink-0 mt-0.5 transition-colors"
            />
          </Link>
        </div>
      </div>

    </div>
  );
}
