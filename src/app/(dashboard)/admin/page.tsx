"use client";

import {
  Shield, Users, DollarSign, TrendingUp, TrendingDown,
  CheckCircle2, XCircle, AlertCircle, MoreVertical,
} from "lucide-react";

const kpis = [
  { label: "Empresas ativas", value: "1.247", change: "+34", up: true, icon: Users, color: "text-blue-400", bg: "bg-blue-500/10" },
  { label: "MRR", value: "R$ 486.230", change: "+R$ 18.400", up: true, icon: DollarSign, color: "text-emerald-400", bg: "bg-emerald-500/10" },
  { label: "Churn mensal", value: "2.3%", change: "-0.4pp", up: false, icon: TrendingDown, color: "text-amber-400", bg: "bg-amber-500/10" },
  { label: "NPS", value: "74", change: "+3", up: true, icon: TrendingUp, color: "text-violet-400", bg: "bg-violet-500/10" },
];

const clients = [
  { name: "TechShop", plan: "Professional", agents: 5, mrr: "R$497", status: "Ativo" },
  { name: "Clínica Vida", plan: "Starter", agents: 1, mrr: "R$197", status: "Ativo" },
  { name: "Imóveis Prime", plan: "Enterprise", agents: 12, mrr: "R$997", status: "Ativo" },
  { name: "EduCursos", plan: "Professional", agents: 3, mrr: "R$497", status: "Trial" },
  { name: "FitGym", plan: "Starter", agents: 1, mrr: "R$197", status: "Inadimplente" },
  { name: "Moda Bella", plan: "Professional", agents: 4, mrr: "R$497", status: "Ativo" },
  { name: "AutoPeças BR", plan: "Enterprise", agents: 8, mrr: "R$997", status: "Ativo" },
  { name: "Pet & Cia", plan: "Starter", agents: 1, mrr: "R$197", status: "Trial" },
];

const statusStyle: Record<string, string> = {
  Ativo: "bg-emerald-500/10 text-emerald-400",
  Trial: "bg-blue-500/10 text-blue-400",
  Inadimplente: "bg-red-500/10 text-red-400",
};

const planStyle: Record<string, string> = {
  Starter: "bg-slate-500/10 text-slate-300",
  Professional: "bg-violet-500/10 text-violet-300",
  Enterprise: "bg-amber-500/10 text-amber-400",
};

const systemStatus = [
  { name: "API WhatsApp", status: "Operacional", ok: true },
  { name: "IA Engine", status: "Operacional", ok: true },
  { name: "Banco de dados", status: "Operacional", ok: true },
  { name: "CDN", status: "Degradado", ok: false, warn: true },
  { name: "Webhooks", status: "Operacional", ok: true },
];

const plans = [
  { name: "Starter", price: "R$197", agents: "1", convs: "1.000", api: false, human: false },
  { name: "Professional", price: "R$497", agents: "5", convs: "10.000", api: true, human: true },
  { name: "Enterprise", price: "R$997", agents: "Ilimitado", convs: "Ilimitado", api: true, human: true },
];

export default function AdminPage() {
  const tokenUsed = 4.2;
  const tokenTotal = 6.2;

  return (
    <div className="p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-white">Painel Administrativo</h1>
          <span className="flex items-center gap-1.5 rounded-full bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-400">
            <Shield className="size-3.5" /> Admin
          </span>
        </div>

        {/* KPIs */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {kpis.map((k) => (
            <div key={k.label} className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-400">{k.label}</p>
                <div className={`grid size-9 place-items-center rounded-xl ${k.bg}`}>
                  <k.icon className={`size-4 ${k.color}`} />
                </div>
              </div>
              <p className="mt-3 text-2xl font-bold text-white">{k.value}</p>
              <p className={`mt-1 flex items-center gap-1 text-xs ${k.up ? "text-emerald-400" : "text-amber-400"}`}>
                {k.up ? <TrendingUp className="size-3.5" /> : <TrendingDown className="size-3.5" />}
                {k.change} vs. mês anterior
              </p>
            </div>
          ))}
        </div>

        {/* Main grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Clients table */}
          <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-white/5">
            <div className="flex items-center justify-between border-b border-white/5 px-6 py-4">
              <h2 className="font-semibold text-white">Clientes recentes</h2>
              <button className="text-xs text-violet-400 hover:text-violet-300">Ver todos →</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5 text-xs text-slate-500">
                    <th className="px-6 py-3 text-left">Empresa</th>
                    <th className="px-4 py-3 text-left">Plano</th>
                    <th className="px-4 py-3 text-left">Agentes</th>
                    <th className="px-4 py-3 text-left">MRR</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {clients.map((c) => (
                    <tr key={c.name} className="border-b border-white/5 hover:bg-white/[0.03]">
                      <td className="px-6 py-3 font-medium text-white">{c.name}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${planStyle[c.plan]}`}>
                          {c.plan}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-300">{c.agents}</td>
                      <td className="px-4 py-3 text-slate-300">{c.mrr}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyle[c.status]}`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button className="text-slate-500 hover:text-white">
                          <MoreVertical className="size-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-5">
            {/* System health */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <h3 className="mb-4 font-semibold text-white">Saúde do sistema</h3>
              <div className="space-y-3">
                {systemStatus.map((s) => (
                  <div key={s.name} className="flex items-center justify-between">
                    <span className="text-sm text-slate-300">{s.name}</span>
                    <span className={`flex items-center gap-1.5 text-xs font-medium ${
                      s.warn ? "text-amber-400" : "text-emerald-400"
                    }`}>
                      {s.warn
                        ? <AlertCircle className="size-3.5" />
                        : <CheckCircle2 className="size-3.5" />}
                      {s.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Token usage */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <h3 className="mb-3 font-semibold text-white">Uso de IA (tokens)</h3>
              <div className="mb-2 flex justify-between text-xs text-slate-400">
                <span>{tokenUsed}M tokens</span>
                <span>{tokenTotal}M tokens</span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-violet-500 to-blue-500"
                  style={{ width: `${(tokenUsed / tokenTotal) * 100}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-slate-400">
                {Math.round((tokenUsed / tokenTotal) * 100)}% do limite mensal utilizado
              </p>
            </div>
          </div>
        </div>

        {/* Plans table */}
        <div className="rounded-2xl border border-white/10 bg-white/5">
          <div className="flex items-center justify-between border-b border-white/5 px-6 py-4">
            <h2 className="font-semibold text-white">Planos e preços</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 text-xs text-slate-500">
                  <th className="px-6 py-3 text-left">Plano</th>
                  <th className="px-4 py-3 text-left">Preço/mês</th>
                  <th className="px-4 py-3 text-left">Agentes</th>
                  <th className="px-4 py-3 text-left">Conversas</th>
                  <th className="px-4 py-3 text-center">API</th>
                  <th className="px-4 py-3 text-center">Humano</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {plans.map((p) => (
                  <tr key={p.name} className="border-b border-white/5 hover:bg-white/[0.03]">
                    <td className="px-6 py-4">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${planStyle[p.name]}`}>
                        {p.name}
                      </span>
                    </td>
                    <td className="px-4 py-4 font-medium text-white">{p.price}</td>
                    <td className="px-4 py-4 text-slate-300">{p.agents}</td>
                    <td className="px-4 py-4 text-slate-300">{p.convs}</td>
                    <td className="px-4 py-4 text-center">
                      {p.api ? <CheckCircle2 className="mx-auto size-4 text-emerald-400" /> : <XCircle className="mx-auto size-4 text-slate-600" />}
                    </td>
                    <td className="px-4 py-4 text-center">
                      {p.human ? <CheckCircle2 className="mx-auto size-4 text-emerald-400" /> : <XCircle className="mx-auto size-4 text-slate-600" />}
                    </td>
                    <td className="px-4 py-4">
                      <button className="rounded-lg border border-white/10 px-3 py-1 text-xs text-slate-300 hover:bg-white/10">
                        Editar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
