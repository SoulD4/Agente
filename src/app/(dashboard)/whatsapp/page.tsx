"use client";

import { useState } from "react";
import {
  MessageCircle,
  Plus,
  RefreshCw,
  CheckCircle2,
  Clock,
  ChevronDown,
  ChevronUp,
  Send,
  Wifi,
  Activity,
  AlertCircle,
  Phone,
  FileText,
} from "lucide-react";

// ─── Log entries ──────────────────────────────────────────────────────────────

const connectionLogs = [
  { time: "14:23:01", icon: "✓", text: "Conexão estabelecida", color: "text-emerald-400" },
  { time: "14:22:58", icon: "→", text: "Handshake enviado", color: "text-blue-400" },
  { time: "14:22:45", icon: "✓", text: "QR Code gerado", color: "text-emerald-400" },
  { time: "14:20:00", icon: "ℹ", text: "Sessão iniciada", color: "text-white/50" },
];

// ─── Fake QR Code (CSS geometric pattern) ────────────────────────────────────

function FakeQRCode() {
  // A simple visual approximation of a QR using a grid of squares
  const pattern = [
    [1,1,1,1,1,1,1,0,1,0,0,1,0,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,1,0,0,1,1,0,0,1,0,0,0,0,0,1],
    [1,0,1,1,1,0,1,0,1,0,1,0,1,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,0,0,1,0,1,0,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,0,1,0,0,0,1,1,0,1,1,1,0,1],
    [1,0,0,0,0,0,1,0,0,0,1,1,0,1,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,0,1,0,1,0,1,1,1,1,1,1,1,1],
    [0,0,0,0,0,0,0,0,1,1,0,1,0,0,0,0,0,0,0,0],
    [1,0,1,1,0,1,1,1,0,0,1,0,1,1,0,1,1,0,1,0],
    [0,1,0,0,1,0,0,0,1,0,0,1,0,0,1,0,0,1,0,1],
    [1,0,1,0,1,1,1,1,0,1,1,0,1,0,1,1,0,0,1,0],
    [0,1,0,1,0,0,0,0,1,0,0,1,0,1,0,0,1,1,0,1],
    [1,0,1,1,1,0,0,1,0,1,0,0,1,0,1,0,0,0,1,0],
    [0,0,0,0,0,0,0,0,1,0,1,1,0,1,0,1,0,1,0,1],
    [1,1,1,1,1,1,1,0,0,1,0,0,1,0,1,0,1,0,0,1],
    [1,0,0,0,0,0,1,0,1,0,1,1,0,1,0,1,0,1,1,0],
    [1,0,1,1,1,0,1,1,0,1,0,0,1,0,1,0,1,0,1,0],
    [1,0,1,1,1,0,1,0,1,1,1,0,0,1,0,1,0,0,0,1],
    [1,0,0,0,0,0,1,0,0,0,1,1,1,0,1,0,1,1,0,0],
    [1,1,1,1,1,1,1,0,1,0,0,1,0,1,0,0,0,0,1,1],
  ];

  return (
    <div className="inline-block p-3 bg-white rounded-xl">
      <div className="grid" style={{ gridTemplateColumns: "repeat(20, 1fr)", gap: "1px" }}>
        {pattern.map((row, ri) =>
          row.map((cell, ci) => (
            <div
              key={`${ri}-${ci}`}
              style={{ width: 9, height: 9, backgroundColor: cell ? "#0a0a0f" : "white" }}
            />
          ))
        )}
      </div>
    </div>
  );
}

// ─── Stepper ─────────────────────────────────────────────────────────────────

interface StepProps {
  number: number;
  title: string;
  active: boolean;
  done: boolean;
}

function Step({ number, title, active, done }: StepProps) {
  return (
    <div className={`flex flex-col items-center gap-2 flex-1 ${active ? "opacity-100" : "opacity-35"}`}>
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 transition-all ${
          done
            ? "bg-emerald-500 text-white"
            : active
            ? "bg-violet-500 text-white shadow-[0_0_16px_rgba(139,92,246,0.5)]"
            : "bg-white/10 text-white/40"
        }`}
      >
        {done ? <CheckCircle2 size={14} /> : number}
      </div>
      <span className="text-xs font-medium text-center leading-tight">{title}</span>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function WhatsAppPage() {
  const [testOpen, setTestOpen] = useState(false);
  const [testPhone, setTestPhone] = useState("");
  const [testMessage, setTestMessage] = useState("");

  return (
    <div className="p-8 space-y-6 max-w-[1000px]">

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Conexões WhatsApp</h1>
          <p className="text-sm text-white/40 mt-0.5">Gerencie seus números conectados e sessões ativas</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-all shadow-[0_0_20px_rgba(139,92,246,0.35)] hover:shadow-[0_0_28px_rgba(139,92,246,0.5)]">
          <Plus size={16} />
          Adicionar número
        </button>
      </div>

      {/* ── Connected number card ── */}
      <div className="bg-white/5 border border-white/10 backdrop-blur rounded-2xl overflow-hidden"
           style={{ borderLeft: "3px solid #34d399" }}>
        <div className="p-5">
          {/* Card header */}
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-emerald-500/15 flex items-center justify-center flex-shrink-0">
                <MessageCircle size={20} className="text-emerald-400" />
              </div>
              <div>
                <p className="text-base font-semibold text-white">(11) 9 9999-0001 · Sofia - Vendas</p>
                <p className="text-xs text-white/40 mt-0.5">+55 11 99999-0001</p>
              </div>
            </div>
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399] animate-pulse" />
              Conectado
            </span>
          </div>

          {/* Stats row */}
          <div className="mt-5 flex items-center gap-0 divide-x divide-white/8">
            <div className="flex items-center gap-2 pr-6">
              <Wifi size={13} className="text-emerald-400 flex-shrink-0" />
              <span className="text-xs text-white/60">Conectado há <span className="text-white font-semibold">23 dias</span></span>
            </div>
            <div className="flex items-center gap-2 px-6">
              <Activity size={13} className="text-blue-400 flex-shrink-0" />
              <span className="text-xs text-white/60"><span className="text-white font-semibold">847 msgs</span>/semana</span>
            </div>
            <div className="flex items-center gap-2 pl-6">
              <CheckCircle2 size={13} className="text-violet-400 flex-shrink-0" />
              <span className="text-xs text-white/60"><span className="text-white font-semibold">99.2%</span> uptime</span>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-5 flex items-center gap-3 flex-wrap">
            <button className="px-4 py-2 rounded-xl border border-red-500/40 text-red-400 hover:bg-red-500/10 text-xs font-semibold transition-all">
              Desconectar
            </button>
            <button className="px-4 py-2 rounded-xl border border-white/10 text-white/60 hover:bg-white/5 hover:text-white text-xs font-semibold transition-all">
              Testar conexão
            </button>
            <button className="px-4 py-2 rounded-xl border border-white/10 text-white/60 hover:bg-white/5 hover:text-white text-xs font-semibold transition-all flex items-center gap-1.5">
              <FileText size={12} />
              Ver logs
            </button>
          </div>
        </div>
      </div>

      {/* ── Add new connection ── */}
      <div className="bg-white/5 border border-white/10 backdrop-blur rounded-2xl p-5 space-y-6">
        <div>
          <h2 className="text-sm font-semibold text-white">Conectar novo número</h2>
          <p className="text-xs text-white/40 mt-0.5">Siga os passos abaixo para vincular um novo número do WhatsApp</p>
        </div>

        {/* Stepper */}
        <div className="flex items-start gap-0 relative">
          {/* connector lines */}
          <div className="absolute top-4 left-[calc(16.66%)] right-[calc(16.66%)] h-px bg-white/10 z-0" />
          <Step number={1} title="Escaneie o QR Code" active={true} done={false} />
          <Step number={2} title="Aguardando conexão..." active={false} done={false} />
          <Step number={3} title="Configurar agente" active={false} done={false} />
        </div>

        {/* QR Code area */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          {/* QR */}
          <div className="flex flex-col items-center gap-3 flex-shrink-0">
            <FakeQRCode />
            <div className="flex items-center gap-1.5 text-amber-400">
              <Clock size={12} />
              <span className="text-xs font-medium">QR expira em <span className="font-bold">45s</span></span>
              <button className="ml-1 p-0.5 rounded hover:bg-white/10 transition-colors" title="Atualizar QR">
                <RefreshCw size={12} className="text-white/40 hover:text-white transition-colors" />
              </button>
            </div>
          </div>

          {/* Instructions */}
          <div className="flex-1 space-y-3">
            <h3 className="text-sm font-semibold text-white">Como conectar</h3>
            <ol className="space-y-2.5">
              {[
                "Abra o WhatsApp no seu celular",
                "Toque em Menu (⋮) ou Configurações",
                "Selecione Aparelhos conectados",
                "Toque em Conectar aparelho",
                "Aponte a câmera para o QR Code ao lado",
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-violet-500/20 border border-violet-500/30 text-violet-300 text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span className="text-xs text-white/60 leading-relaxed">{step}</span>
                </li>
              ))}
            </ol>

            <div className="mt-2 p-3 rounded-xl bg-amber-500/8 border border-amber-500/20 flex items-start gap-2">
              <AlertCircle size={13} className="text-amber-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-300/80">
                O QR Code é atualizado automaticamente a cada 60 segundos por segurança.
              </p>
            </div>
          </div>
        </div>

        {/* Connection logs */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <FileText size={13} className="text-white/40" />
            <h3 className="text-xs font-semibold text-white/60 uppercase tracking-wider">Logs de conexão</h3>
          </div>
          <div className="bg-black/30 rounded-xl border border-white/8 p-4 space-y-1.5 font-mono">
            {connectionLogs.map((log, i) => (
              <div key={i} className="flex items-center gap-3 text-xs">
                <span className="text-white/25 flex-shrink-0">[{log.time}]</span>
                <span className={`${log.color} flex-shrink-0`}>{log.icon}</span>
                <span className="text-white/70">{log.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Test section (collapsible) ── */}
      <div className="bg-white/5 border border-white/10 backdrop-blur rounded-2xl overflow-hidden">
        <button
          onClick={() => setTestOpen((v) => !v)}
          className="w-full flex items-center justify-between p-5 hover:bg-white/[0.03] transition-colors"
        >
          <div className="flex items-center gap-2">
            <Send size={15} className="text-violet-400" />
            <span className="text-sm font-semibold text-white">Enviar mensagem de teste</span>
          </div>
          {testOpen ? (
            <ChevronUp size={16} className="text-white/40" />
          ) : (
            <ChevronDown size={16} className="text-white/40" />
          )}
        </button>

        {testOpen && (
          <div className="px-5 pb-5 pt-0 space-y-4 border-t border-white/8">
            <p className="text-xs text-white/40 mt-4">
              Envie uma mensagem de teste para verificar se a conexão está funcionando corretamente.
            </p>

            <div className="space-y-3">
              {/* Phone input */}
              <div>
                <label className="block text-xs font-medium text-white/60 mb-1.5">
                  Número de destino
                </label>
                <div className="relative">
                  <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                  <input
                    type="tel"
                    value={testPhone}
                    onChange={(e) => setTestPhone(e.target.value)}
                    placeholder="+55 11 99999-0000"
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-white/25 focus:outline-none focus:border-violet-500/50 focus:bg-white/[0.07] transition-all"
                  />
                </div>
              </div>

              {/* Message textarea */}
              <div>
                <label className="block text-xs font-medium text-white/60 mb-1.5">
                  Mensagem
                </label>
                <textarea
                  value={testMessage}
                  onChange={(e) => setTestMessage(e.target.value)}
                  placeholder="Digite sua mensagem de teste..."
                  rows={3}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/25 focus:outline-none focus:border-violet-500/50 focus:bg-white/[0.07] transition-all resize-none"
                />
              </div>

              {/* Send button */}
              <div className="flex justify-end">
                <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold transition-all shadow-[0_0_16px_rgba(52,211,153,0.25)] hover:shadow-[0_0_24px_rgba(52,211,153,0.4)]">
                  <Send size={14} />
                  Enviar teste
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
