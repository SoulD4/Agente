"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  MessageCircle,
  CheckCircle2,
  Copy,
  Check,
  Phone,
  KeyRound,
  Loader2,
  Bot,
  ExternalLink,
  AlertCircle,
} from "lucide-react";

interface AgentLite {
  id: string;
  name: string;
  whatsappPhoneNumberId: string | null;
  whatsappConnected: boolean;
}

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="flex-shrink-0 p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors"
      aria-label="Copiar"
    >
      {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
    </button>
  );
}

function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-1.5">{label}</label>
      <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-xl pl-3.5 pr-1 py-1">
        <span className="flex-1 text-sm text-white/70 font-mono truncate py-1.5">{value}</span>
        <CopyButton value={value} />
      </div>
    </div>
  );
}

export default function WhatsAppPage() {
  const [agents, setAgents] = useState<AgentLite[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState("");
  const [phoneNumberId, setPhoneNumberId] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [webhookUrl, setWebhookUrl] = useState("");
  const [verifyToken, setVerifyToken] = useState("");

  useEffect(() => {
    setWebhookUrl(`${window.location.origin}/api/webhooks/whatsapp`);
    setVerifyToken("zaia-whatsapp-verify");
    fetch("/api/agents")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setAgents(data);
          if (data.length > 0) {
            setSelectedId(data[0].id);
            setPhoneNumberId(data[0].whatsappPhoneNumberId ?? "");
          }
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const selected = agents.find((a) => a.id === selectedId);

  function onSelectAgent(id: string) {
    setSelectedId(id);
    setSaved(false);
    setError("");
    setAccessToken("");
    const a = agents.find((x) => x.id === id);
    setPhoneNumberId(a?.whatsappPhoneNumberId ?? "");
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedId) return;
    setSaving(true);
    setError("");

    const res = await fetch(`/api/agents/${selectedId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        whatsappPhoneNumberId: phoneNumberId.trim(),
        ...(accessToken.trim() ? { whatsappAccessToken: accessToken.trim() } : {}),
        status: "ACTIVE",
      }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Erro ao salvar. Verifique os dados.");
      setSaving(false);
      return;
    }

    setSaved(true);
    setSaving(false);
    setAgents((prev) =>
      prev.map((a) =>
        a.id === selectedId
          ? { ...a, whatsappPhoneNumberId: phoneNumberId.trim(), whatsappConnected: true }
          : a,
      ),
    );
    setAccessToken("");
  }

  const inputCls =
    "w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-violet-500/60 focus:bg-white/[0.07] transition-colors";

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1100px] space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-900/30">
          <MessageCircle size={20} className="text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">WhatsApp</h1>
          <p className="text-sm text-white/40 mt-0.5">Conecte seus agentes ao WhatsApp Business (Meta Cloud API)</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={28} className="animate-spin text-emerald-400" />
        </div>
      ) : agents.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
          <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-5">
            <Bot size={36} className="text-white/20" />
          </div>
          <h3 className="text-base font-semibold text-white mb-2">Crie um agente primeiro</h3>
          <p className="text-sm text-white/40 max-w-xs mb-6">
            Você precisa de pelo menos um agente para conectar ao WhatsApp.
          </p>
          <Link
            href="/agentes/novo"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 transition-all duration-200"
          >
            Criar agente
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 items-start">
          {/* ── Left: config form ── */}
          <form onSubmit={handleSave} className="space-y-6">
            {/* Agent selector */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
              <h2 className="text-sm font-semibold text-white/80 flex items-center gap-2">
                <Bot size={15} className="text-violet-400" />
                Agente
              </h2>
              <div className="flex flex-wrap gap-2">
                {agents.map((a) => (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => onSelectAgent(a.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium border transition-all ${
                      selectedId === a.id
                        ? "bg-violet-600/20 border-violet-500/50 text-violet-200"
                        : "bg-white/[0.03] border-white/10 text-white/50 hover:text-white/80"
                    }`}
                  >
                    {a.name}
                    {a.whatsappConnected && <CheckCircle2 size={13} className="text-emerald-400" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Credentials */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
              <h2 className="text-sm font-semibold text-white/80 flex items-center gap-2">
                <KeyRound size={15} className="text-emerald-400" />
                Credenciais da Meta
              </h2>

              <div>
                <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-1.5">
                  Phone Number ID
                </label>
                <input
                  type="text"
                  placeholder="Ex: 123456789012345"
                  value={phoneNumberId}
                  onChange={(e) => setPhoneNumberId(e.target.value)}
                  className={inputCls}
                  required
                />
                <p className="text-[11px] text-white/30 mt-1.5">
                  Encontre em Meta for Developers → seu app → WhatsApp → API Setup.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/40 uppercase tracking-wider mb-1.5">
                  Access Token {selected?.whatsappConnected && <span className="text-emerald-400 normal-case">(já configurado)</span>}
                </label>
                <input
                  type="password"
                  placeholder={selected?.whatsappConnected ? "•••••••• (deixe em branco para manter)" : "Cole o token permanente aqui"}
                  value={accessToken}
                  onChange={(e) => setAccessToken(e.target.value)}
                  className={inputCls}
                  required={!selected?.whatsappConnected}
                />
                <p className="text-[11px] text-white/30 mt-1.5">
                  Use um <span className="text-white/50">token permanente</span> (System User) para não expirar.
                </p>
              </div>

              {error && (
                <div className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                  <AlertCircle size={15} className="flex-shrink-0" />
                  {error}
                </div>
              )}

              {saved && (
                <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
                  <CheckCircle2 size={15} className="flex-shrink-0" />
                  Agente conectado! Envie uma mensagem para o número para testar.
                </div>
              )}

              <button
                type="submit"
                disabled={saving}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-60 transition-all duration-200 shadow-lg shadow-emerald-900/30"
              >
                {saving ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Salvando…
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={16} />
                    Conectar agente
                  </>
                )}
              </button>
            </div>
          </form>

          {/* ── Right: webhook setup ── */}
          <div className="space-y-4">
            <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5 space-y-4">
              <h3 className="text-sm font-semibold text-white/80">Configurar webhook na Meta</h3>
              <p className="text-xs text-white/40 leading-relaxed">
                No painel do seu app na Meta, em <span className="text-white/60">WhatsApp → Configuration</span>, cole estes valores e assine o campo <span className="text-white/60 font-mono">messages</span>.
              </p>

              <ReadOnlyField label="Callback URL" value={webhookUrl} />
              <ReadOnlyField label="Verify Token" value={verifyToken} />

              <div className="rounded-xl bg-amber-500/5 border border-amber-500/20 p-3">
                <p className="text-[11px] text-amber-300/80 leading-relaxed">
                  ⚠️ Defina a env var <span className="font-mono text-amber-200">WHATSAPP_VERIFY_TOKEN</span> na Vercel com o mesmo valor do Verify Token acima, e <span className="font-mono text-amber-200">WHATSAPP_APP_SECRET</span> com o App Secret da Meta.
                </p>
              </div>

              <a
                href="https://developers.facebook.com/apps"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-violet-400 hover:text-violet-300 transition-colors"
              >
                Abrir Meta for Developers
                <ExternalLink size={12} />
              </a>
            </div>

            <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-white/80 mb-3 flex items-center gap-2">
                <Phone size={14} className="text-emerald-400" />
                Como testar
              </h3>
              <ol className="space-y-2 text-xs text-white/45 leading-relaxed list-decimal list-inside">
                <li>Conecte o agente com Phone Number ID + Access Token.</li>
                <li>Configure o webhook na Meta com a URL e Verify Token ao lado.</li>
                <li>Envie uma mensagem de WhatsApp para o número do agente.</li>
                <li>O agente responde automaticamente e a conversa aparece em <span className="text-white/60">Conversas</span>.</li>
              </ol>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
