"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Bot,
  Phone,
  Clock,
  MessageCircle,
  Plus,
  Check,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type TipoAgente =
  | ""
  | "Vendas/SDR"
  | "Suporte"
  | "Cobranças"
  | "Agendamento"
  | "Personalizado";

type TomDeVoz = "Profissional" | "Amigável" | "Descontraído";

interface FormState {
  nome: string;
  tipo: TipoAgente;
  tomDeVoz: TomDeVoz;
  apresentacao: string;
  whatsapp: string;
  segSex: boolean;
  segSexInicio: string;
  segSexFim: string;
  sabado: boolean;
  sabadoInicio: string;
  sabadoFim: string;
  domingo: boolean;
}

// ─── Avatar gradient by agent name initial ────────────────────────────────────

function getAvatarGradient(nome: string): string {
  const first = nome.trim().charAt(0).toUpperCase();
  const map: Record<string, string> = {
    A: "from-violet-500 to-purple-700",
    B: "from-emerald-500 to-teal-600",
    C: "from-pink-500 to-rose-600",
    D: "from-cyan-500 to-blue-600",
    E: "from-amber-500 to-orange-600",
    F: "from-fuchsia-500 to-purple-600",
    G: "from-green-500 to-emerald-700",
    H: "from-sky-500 to-indigo-600",
    I: "from-indigo-500 to-violet-700",
    J: "from-yellow-500 to-amber-600",
    K: "from-teal-500 to-cyan-700",
    L: "from-amber-500 to-yellow-600",
    M: "from-blue-500 to-blue-700",
    N: "from-red-500 to-rose-700",
    O: "from-orange-500 to-red-600",
    P: "from-purple-500 to-violet-700",
    Q: "from-lime-500 to-green-600",
    R: "from-rose-500 to-pink-700",
    S: "from-violet-500 to-purple-700",
    T: "from-cyan-500 to-teal-700",
    U: "from-blue-400 to-indigo-600",
    V: "from-emerald-400 to-green-700",
    W: "from-fuchsia-400 to-pink-600",
    X: "from-orange-400 to-amber-700",
    Y: "from-yellow-400 to-orange-600",
    Z: "from-violet-400 to-blue-600",
  };
  return map[first] ?? "from-violet-500 to-blue-600";
}

function getInitials(nome: string): string {
  const parts = nome.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "AG";
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function getTipoBadgeColor(tipo: TipoAgente): string {
  switch (tipo) {
    case "Vendas/SDR":
      return "bg-violet-500/20 text-violet-300";
    case "Suporte":
      return "bg-blue-500/20 text-blue-300";
    case "Cobranças":
      return "bg-amber-500/20 text-amber-300";
    case "Agendamento":
      return "bg-emerald-500/20 text-emerald-300";
    case "Personalizado":
      return "bg-pink-500/20 text-pink-300";
    default:
      return "bg-white/10 text-white/40";
  }
}

// ─── Time range picker ────────────────────────────────────────────────────────

function TimeRange({
  inicio,
  fim,
  onChangeInicio,
  onChangeFim,
  disabled,
}: {
  inicio: string;
  fim: string;
  onChangeInicio: (v: string) => void;
  onChangeFim: (v: string) => void;
  disabled: boolean;
}) {
  const inputCls = `min-w-0 flex-1 sm:flex-none sm:w-24 bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white/70 focus:outline-none focus:border-violet-500/60 focus:bg-white/[0.08] transition-colors disabled:opacity-30 disabled:cursor-not-allowed`;
  return (
    <div className="flex items-center gap-2 text-xs text-white/40">
      <input
        type="time"
        value={inicio}
        onChange={(e) => onChangeInicio(e.target.value)}
        disabled={disabled}
        className={inputCls}
      />
      <span className="flex-shrink-0">até</span>
      <input
        type="time"
        value={fim}
        onChange={(e) => onChangeFim(e.target.value)}
        disabled={disabled}
        className={inputCls}
      />
    </div>
  );
}

// ─── Toggle switch ────────────────────────────────────────────────────────────

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex items-center gap-3 group select-none"
    >
      <div
        className={`relative w-9 h-5 rounded-full transition-colors duration-200 ${
          checked ? "bg-violet-600" : "bg-white/10"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${
            checked ? "translate-x-4" : "translate-x-0"
          }`}
        />
      </div>
      <span className="text-sm text-white/60 group-hover:text-white/80 transition-colors">
        {label}
      </span>
    </button>
  );
}

// ─── WhatsApp preview bubble ──────────────────────────────────────────────────

function WhatsAppPreview({
  agentName,
  message,
  gradient,
  initials,
}: {
  agentName: string;
  message: string;
  gradient: string;
  initials: string;
}) {
  const now = new Date();
  const timeStr = now.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="rounded-2xl overflow-hidden border border-white/10 shadow-xl shadow-black/40">
      {/* WhatsApp header */}
      <div className="bg-[#1f2c34] px-4 py-3 flex items-center gap-3">
        <div
          className={`w-9 h-9 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center flex-shrink-0 shadow-md`}
        >
          <span className="text-white text-xs font-bold">{initials}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white leading-tight truncate">
            {agentName || "Meu Agente"}
          </p>
          <p className="text-[11px] text-emerald-400 leading-tight">online</p>
        </div>
        <MessageCircle size={18} className="text-white/30 flex-shrink-0" />
      </div>

      {/* Chat body */}
      <div
        className="bg-[#0d1418] px-4 py-5 min-h-[200px]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.015'%3E%3Cpath d='M20 0L0 20h40L20 0zm0 40L0 20h40L20 40z'/%3E%3C/g%3E%3C/svg%3E")`,
        }}
      >
        {message ? (
          <div className="flex flex-col items-start">
            <div className="max-w-[85%] bg-[#202c33] text-white/90 text-sm rounded-2xl rounded-tl-sm px-4 py-2.5 shadow-md relative">
              {/* tail */}
              <span
                className="absolute -left-[6px] top-0 w-0 h-0"
                style={{
                  borderRight: "6px solid #202c33",
                  borderBottom: "6px solid transparent",
                }}
              />
              <p className="leading-relaxed whitespace-pre-wrap break-words">{message}</p>
              <p className="text-[10px] text-white/30 mt-1 text-right">
                {timeStr} <Check size={10} className="inline text-sky-400 ml-0.5" />
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-32 text-center">
            <MessageCircle size={28} className="text-white/10 mb-2" />
            <p className="text-xs text-white/20">
              A mensagem de apresentação aparecerá aqui
            </p>
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="bg-[#1f2c34] px-3 py-2 flex items-center gap-2">
        <div className="flex-1 bg-[#2a3942] rounded-full px-4 py-2 text-xs text-white/25">
          Mensagem
        </div>
        <div className="w-8 h-8 rounded-full bg-[#00a884] flex items-center justify-center flex-shrink-0">
          <MessageCircle size={14} className="text-white" />
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function NovoAgentePage() {
  const [form, setForm] = useState<FormState>({
    nome: "",
    tipo: "",
    tomDeVoz: "Profissional",
    apresentacao: "",
    whatsapp: "",
    segSex: true,
    segSexInicio: "08:00",
    segSexFim: "18:00",
    sabado: false,
    sabadoInicio: "09:00",
    sabadoFim: "13:00",
    domingo: false,
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  const previewGradient = getAvatarGradient(form.nome);
  const previewInitials = getInitials(form.nome);

  const tomsDeVoz: TomDeVoz[] = ["Profissional", "Amigável", "Descontraído"];
  const tipos: TipoAgente[] = [
    "Vendas/SDR",
    "Suporte",
    "Cobranças",
    "Agendamento",
    "Personalizado",
  ];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    // Simulate async save
    await new Promise((r) => setTimeout(r, 900));
    setSubmitting(false);
    setSubmitted(true);
  }

  const labelCls = "block text-xs font-semibold text-white/50 uppercase tracking-wider mb-1.5";
  const inputCls =
    "w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-violet-500/60 focus:bg-white/[0.07] transition-colors";

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1200px]">

      {/* ── Back + title ── */}
      <div className="mb-8">
        <Link
          href="/agentes"
          className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors mb-4 group"
        >
          <ArrowLeft
            size={15}
            className="group-hover:-translate-x-0.5 transition-transform"
          />
          Voltar para Agentes
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center shadow-lg shadow-violet-900/30">
            <Bot size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Novo Agente
            </h1>
            <p className="text-sm text-white/40 mt-0.5">
              Configure seu novo agente de IA para WhatsApp
            </p>
          </div>
        </div>
      </div>

      {/* ── Two-column layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 lg:gap-8 items-start">

        {/* ── Left: form ── */}
        <form onSubmit={handleSubmit} className="space-y-6 min-w-0">

          {/* Card: identidade */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-6 space-y-5 min-w-0">
            <h2 className="text-sm font-semibold text-white/80 flex items-center gap-2">
              <Bot size={15} className="text-violet-400" />
              Identidade do agente
            </h2>

            {/* Nome */}
            <div>
              <label className={labelCls}>Nome do agente</label>
              <input
                type="text"
                placeholder="Ex: Sofia"
                value={form.nome}
                onChange={(e) => set("nome", e.target.value)}
                className={inputCls}
                required
              />
            </div>

            {/* Tipo */}
            <div>
              <label className={labelCls}>Tipo</label>
              <select
                value={form.tipo}
                onChange={(e) => set("tipo", e.target.value as TipoAgente)}
                className={`${inputCls} appearance-none cursor-pointer`}
                required
              >
                <option value="" disabled className="bg-[#111118]">
                  Selecione o tipo
                </option>
                {tipos.map((t) => (
                  <option key={t} value={t} className="bg-[#111118]">
                    {t}
                  </option>
                ))}
              </select>
            </div>

            {/* Tom de voz */}
            <div>
              <label className={labelCls}>Tom de voz</label>
              <div className="flex gap-3">
                {tomsDeVoz.map((tom) => {
                  const active = form.tomDeVoz === tom;
                  return (
                    <button
                      key={tom}
                      type="button"
                      onClick={() => set("tomDeVoz", tom)}
                      className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all duration-150 ${
                        active
                          ? "bg-violet-600/20 border-violet-500/50 text-violet-300"
                          : "bg-white/[0.03] border-white/10 text-white/45 hover:text-white/70 hover:bg-white/[0.06]"
                      }`}
                    >
                      {tom}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Card: mensagem */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-6 space-y-5 min-w-0">
            <h2 className="text-sm font-semibold text-white/80 flex items-center gap-2">
              <MessageCircle size={15} className="text-violet-400" />
              Mensagem de apresentação
            </h2>

            <div>
              <label className={labelCls}>Apresentação</label>
              <textarea
                placeholder="Ex: Olá! Sou a Sofia, assistente virtual da empresa. Como posso te ajudar hoje?"
                value={form.apresentacao}
                onChange={(e) => set("apresentacao", e.target.value)}
                rows={4}
                className={`${inputCls} resize-none leading-relaxed`}
              />
              <p className="text-[11px] text-white/30 mt-1.5">
                Esta será a primeira mensagem enviada ao cliente ao iniciar uma conversa.
              </p>
            </div>
          </div>

          {/* Card: WhatsApp */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-6 space-y-5 min-w-0">
            <h2 className="text-sm font-semibold text-white/80 flex items-center gap-2">
              <Phone size={15} className="text-emerald-400" />
              Número WhatsApp
            </h2>

            <div>
              <label className={labelCls}>Número</label>
              <input
                type="tel"
                placeholder="(11) 9 0000-0000"
                value={form.whatsapp}
                onChange={(e) => set("whatsapp", e.target.value)}
                className={inputCls}
              />
              <p className="text-[11px] text-white/30 mt-1.5">
                Número vinculado ao WhatsApp Business para este agente.
              </p>
            </div>
          </div>

          {/* Card: Horário */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-6 space-y-5 min-w-0">
            <h2 className="text-sm font-semibold text-white/80 flex items-center gap-2">
              <Clock size={15} className="text-violet-400" />
              Horário de atendimento
            </h2>

            {/* Seg–Sex */}
            <div className="space-y-3">
              <Toggle
                checked={form.segSex}
                onChange={(v) => set("segSex", v)}
                label="Segunda a Sexta"
              />
              {form.segSex && (
                <div className="ml-0 sm:ml-12">
                  <TimeRange
                    inicio={form.segSexInicio}
                    fim={form.segSexFim}
                    onChangeInicio={(v) => set("segSexInicio", v)}
                    onChangeFim={(v) => set("segSexFim", v)}
                    disabled={false}
                  />
                </div>
              )}
            </div>

            <div className="border-t border-white/5" />

            {/* Sábado */}
            <div className="space-y-3">
              <Toggle
                checked={form.sabado}
                onChange={(v) => set("sabado", v)}
                label="Sábado"
              />
              {form.sabado && (
                <div className="ml-0 sm:ml-12">
                  <TimeRange
                    inicio={form.sabadoInicio}
                    fim={form.sabadoFim}
                    onChangeInicio={(v) => set("sabadoInicio", v)}
                    onChangeFim={(v) => set("sabadoFim", v)}
                    disabled={false}
                  />
                </div>
              )}
            </div>

            <div className="border-t border-white/5" />

            {/* Domingo */}
            <Toggle
              checked={form.domingo}
              onChange={(v) => set("domingo", v)}
              label="Domingo"
            />
          </div>

          {/* CTA */}
          <button
            type="submit"
            disabled={submitting || submitted}
            className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-violet-900/30"
          >
            {submitted ? (
              <>
                <Check size={16} />
                Agente criado!
              </>
            ) : submitting ? (
              <>
                <svg
                  className="animate-spin w-4 h-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  />
                </svg>
                Criando agente...
              </>
            ) : (
              <>
                <Plus size={16} />
                Criar Agente
              </>
            )}
          </button>
        </form>

        {/* ── Right: sticky preview ── */}
        <div className="lg:sticky lg:top-[80px] space-y-4 min-w-0 w-full max-w-md mx-auto lg:max-w-none lg:mx-0">
          {/* Preview heading */}
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-white/40 uppercase tracking-wider">
              Preview
            </span>
            <span className="flex-1 h-px bg-white/5" />
            {form.tipo && (
              <span
                className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${getTipoBadgeColor(
                  form.tipo
                )}`}
              >
                {form.tipo}
              </span>
            )}
          </div>

          {/* WhatsApp mock */}
          <WhatsAppPreview
            agentName={form.nome}
            message={form.apresentacao}
            gradient={previewGradient}
            initials={previewInitials}
          />

          {/* Info card */}
          <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-4 space-y-3">
            <p className="text-[11px] font-semibold text-white/40 uppercase tracking-wider">
              Resumo do agente
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div
                  className={`w-7 h-7 rounded-full bg-gradient-to-br ${previewGradient} flex items-center justify-center flex-shrink-0`}
                >
                  <span className="text-white text-[10px] font-bold">
                    {previewInitials}
                  </span>
                </div>
                <span className="text-sm font-medium text-white/80">
                  {form.nome || "—"}
                </span>
              </div>
              {form.tipo && (
                <div className="flex items-center gap-2 text-xs text-white/40">
                  <Bot size={12} className="text-white/25" />
                  {form.tipo}
                </div>
              )}
              {form.whatsapp && (
                <div className="flex items-center gap-2 text-xs text-white/40">
                  <Phone size={12} className="text-emerald-400/70" />
                  <span className="font-mono">{form.whatsapp}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-xs text-white/40">
                <Clock size={12} className="text-white/25" />
                <span>
                  {form.segSex
                    ? `Seg–Sex ${form.segSexInicio}–${form.segSexFim}`
                    : "Seg–Sex desativado"}
                  {form.sabado ? `, Sáb ${form.sabadoInicio}–${form.sabadoFim}` : ""}
                  {form.domingo ? ", Dom" : ""}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-white/40">
                <span className="text-white/25 text-[10px]">TOM</span>
                {form.tomDeVoz}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
