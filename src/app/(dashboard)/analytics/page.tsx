"use client";

import { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  MessageCircle,
  Users,
  Zap,
  CalendarClock,
  Clock,
  BarChart3,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import {
  BarChart,
  Bar,
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

const barData = Array.from({ length: 30 }, (_, i) => {
  const day = i + 1;
  const base = 60 + Math.floor(Math.sin(i * 0.4) * 30 + Math.random() * 40);
  return { dia: day % 5 === 0 ? `D${day}` : day % 2 === 0 ? `${day}` : "", valor: Math.max(20, base) };
});

// override a few to make specific labels readable
const barDataLabeled = barData.map((d, i) => ({
  ...d,
  dia: [0, 4, 9, 14, 19, 24, 29].includes(i) ? `${i + 1}` : "",
}));

const donutData = [
  { name: "Problema resolvido", value: 60, color: "#34d399" },
  { name: "Transferido", value: 25, color: "#60a5fa" },
  { name: "Abandono", value: 15, color: "#f87171" },
];

const topQuestions = [
  { pergunta: "Qual o horário de atendimento?", frequencia: 342, taxa: "97%", ultima: "há 2 min" },
  { pergunta: "Como faço para cancelar?", frequencia: 289, taxa: "94%", ultima: "há 5 min" },
  { pergunta: "Vocês têm frete grátis?", frequencia: 241, taxa: "99%", ultima: "há 8 min" },
  { pergunta: "Posso parcelar no cartão?", frequencia: 198, taxa: "100%", ultima: "há 12 min" },
  { pergunta: "Qual o prazo de entrega?", frequencia: 176, taxa: "96%", ultima: "há 19 min" },
  { pergunta: "Como rastrear meu pedido?", frequencia: 154, taxa: "98%", ultima: "há 23 min" },
  { pergunta: "Vocês fazem troca?", frequencia: 132, taxa: "91%", ultima: "há 31 min" },
  { pergunta: "Tem desconto para pagamento à vista?", frequencia: 114, taxa: "95%", ultima: "há 47 min" },
];

// Heatmap: 7 days × 12 time blocks (2h each)
const days = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const timeBlocks = ["00h", "02h", "04h", "06h", "08h", "10h", "12h", "14h", "16h", "18h", "20h", "22h"];

// Traffic values 0-10
const heatmapData: number[][] = [
  [1, 0, 0, 0, 2, 6, 7, 5, 4, 5, 4, 2], // Dom
  [1, 0, 0, 0, 3, 8, 9, 10, 8, 9, 6, 2], // Seg
  [1, 0, 0, 0, 3, 9, 10, 10, 9, 10, 7, 3], // Ter
  [1, 0, 0, 0, 2, 8, 10, 9, 8, 9, 7, 2], // Qua
  [1, 0, 0, 0, 3, 9, 10, 10, 8, 10, 7, 3], // Qui
  [1, 0, 0, 0, 4, 8, 9, 8, 7, 7, 8, 5], // Sex
  [1, 0, 0, 0, 2, 5, 6, 5, 4, 5, 5, 3], // Sáb
];

// opacity map from traffic value
function heatOpacity(val: number): string {
  const opacities = ["opacity-[0.05]", "opacity-10", "opacity-20", "opacity-25", "opacity-30", "opacity-40", "opacity-50", "opacity-60", "opacity-70", "opacity-85", "opacity-100"];
  return opacities[Math.min(val, 10)] ?? "opacity-10";
}

// ─── KPI Card ─────────────────────────────────────────────────────────────────

interface KPICardProps {
  title: string;
  value: string;
  change: string;
  positive: boolean;
  unit?: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
}

function KPICard({ title, value, change, positive, unit, icon: Icon, iconBg, iconColor }: KPICardProps) {
  const TrendIcon = positive ? TrendingUp : TrendingDown;
  const trendColor = positive ? "text-emerald-400" : "text-red-400";
  const trendBg = positive ? "bg-emerald-500/10 border-emerald-500/20" : "bg-red-500/10 border-red-500/20";

  return (
    <div className="bg-white/5 border border-white/10 backdrop-blur rounded-2xl p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <div className={`w-9 h-9 rounded-xl ${iconBg} flex items-center justify-center flex-shrink-0`}>
          <Icon size={16} className={iconColor} />
        </div>
        <span className={`flex items-center gap-1 text-xs font-semibold ${trendColor} ${trendBg} border rounded-full px-2 py-0.5`}>
          <TrendIcon size={10} />
          {change}
        </span>
      </div>
      <div>
        <p className="text-xs text-white/40 mb-1">{title}</p>
        <p className="text-2xl font-bold text-white tracking-tight">
          {value}
          {unit && <span className="text-sm font-medium text-white/50 ml-1">{unit}</span>}
        </p>
      </div>
    </div>
  );
}

// ─── Custom Bar Tooltip ───────────────────────────────────────────────────────

function BarTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1a1a2e] border border-white/10 rounded-xl px-3 py-2 shadow-xl">
        <p className="text-xs text-white/50 mb-0.5">Dia {label}</p>
        <p className="text-sm font-semibold text-violet-300">{payload[0].value} conversas</p>
      </div>
    );
  }
  return null;
}

// ─── Custom Donut Tooltip ─────────────────────────────────────────────────────

function DonutTooltip({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number }> }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1a1a2e] border border-white/10 rounded-xl px-3 py-2 shadow-xl">
        <p className="text-xs text-white/50 mb-0.5">{payload[0].name}</p>
        <p className="text-sm font-semibold text-white">{payload[0].value}%</p>
      </div>
    );
  }
  return null;
}

// ─── Sortable table header ────────────────────────────────────────────────────

type SortDir = "asc" | "desc" | null;

function SortableHeader({
  label,
  active,
  dir,
  onClick,
}: {
  label: string;
  active: boolean;
  dir: SortDir;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1 text-xs font-semibold text-white/50 hover:text-white/80 transition-colors uppercase tracking-wider"
    >
      {label}
      <span className="flex flex-col ml-0.5">
        <ChevronUp size={9} className={active && dir === "asc" ? "text-violet-400" : "text-white/20"} />
        <ChevronDown size={9} className={active && dir === "desc" ? "text-violet-400" : "text-white/20"} />
      </span>
    </button>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState<"7" | "30" | "90">("30");
  const [sortCol, setSortCol] = useState<"frequencia" | "taxa" | "ultima">("frequencia");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  function handleSort(col: "frequencia" | "taxa" | "ultima") {
    if (sortCol === col) {
      setSortDir((d) => (d === "desc" ? "asc" : "desc"));
    } else {
      setSortCol(col);
      setSortDir("desc");
    }
  }

  const dateOptions: Array<{ label: string; value: "7" | "30" | "90" }> = [
    { label: "7 dias", value: "7" },
    { label: "30 dias", value: "30" },
    { label: "90 dias", value: "90" },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-[1400px]">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white">Analytics</h1>
          <p className="text-sm text-white/40 mt-0.5">Visão geral de desempenho e engajamento</p>
        </div>

        {/* Date range picker */}
        <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-xl p-1 self-start sm:self-auto">
          {dateOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setDateRange(opt.value)}
              className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                dateRange === opt.value
                  ? "bg-violet-600 text-white shadow-[0_0_12px_rgba(139,92,246,0.4)]"
                  : "text-white/50 hover:text-white/80 hover:bg-white/5"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── KPI row ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <KPICard
          title="Conversas totais"
          value="2.847"
          change="+18%"
          positive={true}
          icon={MessageCircle}
          iconBg="bg-violet-500/15"
          iconColor="text-violet-400"
        />
        <KPICard
          title="Leads gerados"
          value="384"
          change="+23%"
          positive={true}
          icon={Users}
          iconBg="bg-blue-500/15"
          iconColor="text-blue-400"
        />
        <KPICard
          title="Taxa de conversão"
          value="13.5"
          unit="%"
          change="+2.1pp"
          positive={true}
          icon={Zap}
          iconBg="bg-emerald-500/15"
          iconColor="text-emerald-400"
        />
        <KPICard
          title="Agendamentos"
          value="127"
          change="+31%"
          positive={true}
          icon={CalendarClock}
          iconBg="bg-amber-500/15"
          iconColor="text-amber-400"
        />
        <KPICard
          title="Tempo médio de resposta"
          value="1.2"
          unit="s"
          change="-0.3s"
          positive={true}
          icon={Clock}
          iconBg="bg-sky-500/15"
          iconColor="text-sky-400"
        />
        <KPICard
          title="Mensagens enviadas"
          value="14.230"
          change="+15%"
          positive={true}
          icon={BarChart3}
          iconBg="bg-pink-500/15"
          iconColor="text-pink-400"
        />
      </div>

      {/* ── Charts row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Bar chart — 2/3 */}
        <div className="lg:col-span-2 min-w-0 bg-white/5 border border-white/10 backdrop-blur rounded-2xl p-5">
          <div className="mb-5">
            <h2 className="text-sm font-semibold text-white">Conversas por dia</h2>
            <p className="text-xs text-white/40 mt-0.5">Volume diário nos últimos {dateRange} dias</p>
          </div>
          <div className="w-full h-72 min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={barDataLabeled}
              margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
              barCategoryGap="20%"
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.05)"
                vertical={false}
              />
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
              <Tooltip content={<BarTooltip />} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
              <Bar
                dataKey="valor"
                fill="#7c3aed"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
          </div>
        </div>

        {/* Donut chart — 1/3 */}
        <div className="lg:col-span-1 min-w-0 bg-white/5 border border-white/10 backdrop-blur rounded-2xl p-5 flex flex-col">
          <div className="mb-3">
            <h2 className="text-sm font-semibold text-white">Motivos de encerramento</h2>
            <p className="text-xs text-white/40 mt-0.5">Distribuição por categoria</p>
          </div>

          <div className="flex-1 flex flex-col">
            <div className="w-full h-44 min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={donutData}
                  cx="50%"
                  cy="50%"
                  innerRadius={52}
                  outerRadius={76}
                  paddingAngle={3}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {donutData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<DonutTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            </div>

            {/* Legend */}
            <div className="mt-3 space-y-2">
              {donutData.map((entry) => (
                <div key={entry.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: entry.color }}
                    />
                    <span className="text-xs text-white/60 truncate max-w-[130px]">{entry.name}</span>
                  </div>
                  <span className="text-xs font-semibold text-white/80">{entry.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Top questions table ── */}
      <div className="bg-white/5 border border-white/10 backdrop-blur rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-white/8">
          <h2 className="text-sm font-semibold text-white">Top perguntas recebidas</h2>
          <p className="text-xs text-white/40 mt-0.5">Perguntas mais frequentes nos últimos {dateRange} dias</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="border-b border-white/8">
                <th className="px-5 py-3 text-left">
                  <span className="text-xs font-semibold text-white/50 uppercase tracking-wider">
                    Pergunta
                  </span>
                </th>
                <th className="px-5 py-3 text-left">
                  <SortableHeader
                    label="Frequência"
                    active={sortCol === "frequencia"}
                    dir={sortCol === "frequencia" ? sortDir : null}
                    onClick={() => handleSort("frequencia")}
                  />
                </th>
                <th className="px-5 py-3 text-left">
                  <SortableHeader
                    label="Taxa de resposta"
                    active={sortCol === "taxa"}
                    dir={sortCol === "taxa" ? sortDir : null}
                    onClick={() => handleSort("taxa")}
                  />
                </th>
                <th className="px-5 py-3 text-left">
                  <SortableHeader
                    label="Última vez"
                    active={sortCol === "ultima"}
                    dir={sortCol === "ultima" ? sortDir : null}
                    onClick={() => handleSort("ultima")}
                  />
                </th>
              </tr>
            </thead>
            <tbody>
              {topQuestions.map((row, i) => (
                <tr
                  key={i}
                  className="border-b border-white/[0.04] hover:bg-white/[0.03] transition-colors"
                >
                  <td className="px-5 py-3.5">
                    <span className="text-sm text-white/80">{row.pergunta}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-white">{row.frequencia}</span>
                      <div className="flex-1 max-w-[80px] h-1 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-violet-500 rounded-full"
                          style={{ width: `${(row.frequencia / 342) * 100}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        parseInt(row.taxa) >= 98
                          ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25"
                          : parseInt(row.taxa) >= 94
                          ? "bg-blue-500/15 text-blue-400 border border-blue-500/25"
                          : "bg-amber-500/15 text-amber-400 border border-amber-500/25"
                      }`}
                    >
                      {row.taxa}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-xs text-white/40">{row.ultima}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Heatmap ── */}
      <div className="bg-white/5 border border-white/10 backdrop-blur rounded-2xl p-5">
        <div className="mb-5 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold text-white">Horários de pico</h2>
            <p className="text-xs text-white/40 mt-0.5">Volume de conversas por hora e dia da semana</p>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-white/40">Menos ativo</span>
            <div className="flex items-center gap-0.5">
              {[0.05, 0.15, 0.3, 0.5, 0.7, 0.9, 1].map((op, i) => (
                <div
                  key={i}
                  className="w-4 h-4 rounded-sm bg-violet-500"
                  style={{ opacity: op }}
                />
              ))}
            </div>
            <span className="text-xs text-white/40">Mais ativo</span>
          </div>
        </div>

        {/* Scrollable heatmap (day labels stay pinned left, only cells scroll) */}
        <div className="overflow-x-auto">
          <div className="min-w-[520px]">
            {/* Time axis labels */}
            <div className="ml-10 mb-1 grid gap-0.5" style={{ gridTemplateColumns: `repeat(${timeBlocks.length}, minmax(20px, 1fr))` }}>
              {timeBlocks.map((t) => (
                <div key={t} className="text-[10px] text-white/30 text-center">{t}</div>
              ))}
            </div>

            {/* Grid */}
            <div className="space-y-1">
              {heatmapData.map((row, di) => (
                <div key={di} className="flex items-center gap-2">
                  {/* Day label */}
                  <div className="w-8 text-[11px] text-white/40 text-right flex-shrink-0 font-medium">
                    {days[di]}
                  </div>

                  {/* Cells */}
                  <div
                    className="flex-1 grid gap-0.5"
                    style={{ gridTemplateColumns: `repeat(${timeBlocks.length}, minmax(20px, 1fr))` }}
                  >
                    {row.map((val, ti) => (
                      <div
                        key={ti}
                        className={`h-7 min-w-[20px] rounded-md bg-violet-500 ${heatOpacity(val)} hover:ring-1 hover:ring-violet-400/60 transition-all cursor-default`}
                        title={`${days[di]} ${timeBlocks[ti]} — tráfego ${val * 10}%`}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
