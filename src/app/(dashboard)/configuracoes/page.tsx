"use client";

import { useState } from "react";
import {
  User, Building2, CreditCard, Plug, Bell, Shield,
  Check, Eye, EyeOff, ChevronRight, Upload, AlertCircle,
} from "lucide-react";

const tabs = [
  { id: "perfil", label: "Perfil", icon: User },
  { id: "empresa", label: "Empresa", icon: Building2 },
  { id: "plano", label: "Plano", icon: CreditCard },
  { id: "integracoes", label: "Integrações", icon: Plug },
  { id: "notificacoes", label: "Notificações", icon: Bell },
  { id: "seguranca", label: "Segurança", icon: Shield },
];

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        checked ? "bg-violet-600" : "bg-white/10"
      }`}
    >
      <span
        className={`inline-block size-4 rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

function PerfilTab() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-white">Perfil</h2>
        <p className="text-sm text-slate-400">Suas informações pessoais.</p>
      </div>
      <div className="flex items-center gap-5">
        <div className="grid size-20 place-items-center rounded-full bg-gradient-to-br from-violet-500 to-blue-600 text-2xl font-bold text-white">
          JS
        </div>
        <button className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10">
          <Upload className="mr-2 inline size-4" /> Trocar foto
        </button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {[
          { label: "Nome completo", value: "João Silva" },
          { label: "Cargo", value: "CEO" },
          { label: "Telefone", value: "(11) 99999-0000" },
        ].map((f) => (
          <div key={f.label}>
            <label className="mb-1.5 block text-sm font-medium text-slate-300">{f.label}</label>
            <input
              defaultValue={f.value}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none transition focus:border-violet-500 focus:bg-white/[0.07]"
            />
          </div>
        ))}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-300">Email</label>
          <div className="flex items-center gap-2">
            <input
              defaultValue="joao@empresa.com"
              readOnly
              className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-slate-400 outline-none"
            />
            <span className="flex items-center gap-1 rounded-lg bg-emerald-500/10 px-2 py-1 text-xs text-emerald-400">
              <Check className="size-3" /> Verificado
            </span>
          </div>
        </div>
      </div>
      <button className="rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-violet-500/25 transition hover:from-violet-500 hover:to-blue-500">
        Salvar alterações
      </button>
    </div>
  );
}

function EmpresaTab() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-white">Empresa</h2>
        <p className="text-sm text-slate-400">Dados do seu negócio.</p>
      </div>
      <div className="flex items-center gap-5">
        <div className="flex size-20 items-center justify-center rounded-2xl border-2 border-dashed border-white/15 text-slate-500">
          <Upload className="size-6" />
        </div>
        <div>
          <p className="text-sm font-medium text-white">Logo da empresa</p>
          <p className="text-xs text-slate-400">PNG, JPG até 2MB</p>
          <button className="mt-2 text-xs font-medium text-violet-400 hover:text-violet-300">Fazer upload</button>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {[
          { label: "Nome da empresa", value: "Empresa Exemplo Ltda." },
          { label: "CNPJ", value: "12.345.678/0001-90" },
          { label: "Site", value: "https://empresa.com.br" },
          { label: "Endereço", value: "Av. Paulista, 1000 — SP" },
        ].map((f) => (
          <div key={f.label}>
            <label className="mb-1.5 block text-sm font-medium text-slate-300">{f.label}</label>
            <input
              defaultValue={f.value}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none transition focus:border-violet-500"
            />
          </div>
        ))}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-300">Segmento</label>
          <select className="w-full rounded-xl border border-white/10 bg-[#1a1a24] px-3 py-2.5 text-sm text-white outline-none focus:border-violet-500">
            {["Varejo", "Serviços", "Saúde", "Imóveis", "Educação", "Outro"].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>
      <button className="rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-violet-500/25 transition hover:from-violet-500 hover:to-blue-500">
        Salvar alterações
      </button>
    </div>
  );
}

function PlanoTab() {
  const features = ["5 agentes de IA", "10.000 conversas/mês", "Templates de agentes", "Transferência humana", "Analytics avançado", "Integrações + API"];
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-white">Plano e cobrança</h2>
        <p className="text-sm text-slate-400">Gerencie sua assinatura.</p>
      </div>
      <div className="rounded-2xl border border-violet-500/30 bg-violet-500/5 p-4 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-white">Professional</h3>
              <span className="rounded-full bg-violet-500/20 px-2 py-0.5 text-xs font-medium text-violet-300">Ativo</span>
            </div>
            <p className="mt-1 text-2xl font-bold text-white">R$ 497<span className="text-base font-normal text-slate-400">/mês</span></p>
            <p className="mt-1 text-xs text-slate-400">Próxima cobrança: 15/07/2026</p>
          </div>
          <button className="shrink-0 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10">
            Fazer upgrade
          </button>
        </div>
        <ul className="mt-4 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
          {features.map((f) => (
            <li key={f} className="flex items-center gap-1.5 text-xs text-slate-300">
              <Check className="size-3.5 text-emerald-400" /> {f}
            </li>
          ))}
        </ul>
      </div>
      <div className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5">
        <h4 className="text-sm font-medium text-white">Uso este mês</h4>
        {[
          { label: "Agentes", used: 3, total: 5, color: "bg-blue-500" },
          { label: "Conversas", used: 7234, total: 10000, color: "bg-violet-500", warning: true },
        ].map((u) => (
          <div key={u.label}>
            <div className="mb-1.5 flex justify-between text-xs text-slate-400">
              <span>{u.label}</span>
              <span>{u.used.toLocaleString("pt-BR")} / {u.total.toLocaleString("pt-BR")}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className={`h-full rounded-full ${u.color} transition-all`}
                style={{ width: `${(u.used / u.total) * 100}%` }}
              />
            </div>
            {u.warning && (
              <p className="mt-1 flex items-center gap-1 text-xs text-amber-400">
                <AlertCircle className="size-3" /> 72% utilizado — considere fazer upgrade
              </p>
            )}
          </div>
        ))}
      </div>
      <button className="text-sm text-red-400 hover:text-red-300">Cancelar assinatura</button>
    </div>
  );
}

function IntegracoesTab() {
  const integrations = [
    { name: "Google Calendar", desc: "Sincronize agendamentos", connected: true },
    { name: "Google Sheets", desc: "Exporte leads automaticamente", connected: false },
    { name: "Zapier", desc: "Conecte com +5.000 apps", connected: false },
    { name: "Make (Integromat)", desc: "Automações avançadas", connected: false },
    { name: "Webhook", desc: "https://suaapi.com/webhook", connected: true },
  ];
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-white">Integrações</h2>
        <p className="text-sm text-slate-400">Conecte a Zaia com outras ferramentas.</p>
      </div>
      <div className="space-y-3">
        {integrations.map((i) => (
          <div key={i.name} className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="min-w-0">
              <p className="font-medium text-white">{i.name}</p>
              <p className="truncate text-xs text-slate-400">{i.desc}</p>
            </div>
            {i.connected ? (
              <div className="flex shrink-0 items-center gap-3">
                <span className="flex items-center gap-1.5 text-xs text-emerald-400">
                  <span className="size-1.5 rounded-full bg-emerald-400" /> Conectado
                </span>
                <button className="text-xs text-slate-400 hover:text-red-400">Desconectar</button>
              </div>
            ) : (
              <button className="shrink-0 rounded-xl border border-violet-500/40 px-3 py-1.5 text-xs font-medium text-violet-300 hover:bg-violet-500/10">
                Conectar
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function NotificacoesTab() {
  const [settings, setSettings] = useState({
    novo_lead: true,
    aguardando_humano: true,
    agente_desconectado: true,
    relatorio_semanal: false,
    dicas: false,
  });
  const items = [
    { key: "novo_lead", label: "Novo lead capturado", desc: "Quando um agente captura um novo lead" },
    { key: "aguardando_humano", label: "Conversa aguardando humano", desc: "Quando precisa de intervenção manual" },
    { key: "agente_desconectado", label: "Agente desconectado", desc: "Quando perde conexão com WhatsApp" },
    { key: "relatorio_semanal", label: "Relatório semanal", desc: "Resumo de desempenho toda segunda-feira" },
    { key: "dicas", label: "Dicas e novidades", desc: "Atualizações e melhores práticas da Zaia" },
  ] as const;
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-white">Notificações</h2>
        <p className="text-sm text-slate-400">Escolha quando quer ser alertado.</p>
      </div>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.key} className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="min-w-0">
              <p className="text-sm font-medium text-white">{item.label}</p>
              <p className="text-xs text-slate-400">{item.desc}</p>
            </div>
            <div className="shrink-0">
              <Toggle
                checked={settings[item.key]}
                onChange={() => setSettings((s) => ({ ...s, [item.key]: !s[item.key] }))}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SegurancaTab() {
  const [show, setShow] = useState({ atual: false, nova: false, confirmar: false });
  const [twoFA, setTwoFA] = useState(false);
  const sessions = [
    { device: "Chrome · macOS", location: "São Paulo, BR", last: "Agora" },
    { device: "Safari · iPhone", location: "São Paulo, BR", last: "Ontem às 18:42" },
    { device: "Chrome · Windows", location: "Rio de Janeiro, BR", last: "12/06/2026" },
  ];
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-white">Segurança</h2>
        <p className="text-sm text-slate-400">Controle de acesso à sua conta.</p>
      </div>
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5 space-y-4">
        <h4 className="text-sm font-medium text-white">Alterar senha</h4>
        {(["atual", "nova", "confirmar"] as const).map((k) => (
          <div key={k}>
            <label className="mb-1.5 block text-sm text-slate-300 capitalize">
              {k === "atual" ? "Senha atual" : k === "nova" ? "Nova senha" : "Confirmar nova senha"}
            </label>
            <div className="relative">
              <input
                type={show[k] ? "text" : "password"}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 pr-10 text-sm text-white outline-none focus:border-violet-500"
              />
              <button
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                onClick={() => setShow((s) => ({ ...s, [k]: !s[k] }))}
              >
                {show[k] ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>
        ))}
        <button className="rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-5 py-2.5 text-sm font-medium text-white">
          Alterar senha
        </button>
      </div>
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="font-medium text-white">Autenticação em dois fatores</p>
            <p className="text-xs text-slate-400">Adicione uma camada extra de segurança</p>
          </div>
          <div className="shrink-0">
            <Toggle checked={twoFA} onChange={() => setTwoFA((v) => !v)} />
          </div>
        </div>
        {twoFA && (
          <p className="mt-3 text-xs text-emerald-400 flex items-center gap-1">
            <Check className="size-3.5" /> 2FA ativo — use seu app autenticador
          </p>
        )}
      </div>
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5 space-y-3">
        <h4 className="text-sm font-medium text-white">Sessões ativas</h4>
        {sessions.map((s) => (
          <div key={s.device} className="flex items-center justify-between gap-3 rounded-xl bg-white/5 px-4 py-3">
            <div className="min-w-0">
              <p className="truncate text-sm text-white">{s.device}</p>
              <p className="truncate text-xs text-slate-400">{s.location} · {s.last}</p>
            </div>
            <button className="shrink-0 text-xs text-red-400 hover:text-red-300">Encerrar</button>
          </div>
        ))}
      </div>
    </div>
  );
}

const tabContent: Record<string, React.ReactNode> = {
  perfil: <PerfilTab />,
  empresa: <EmpresaTab />,
  plano: <PlanoTab />,
  integracoes: <IntegracoesTab />,
  notificacoes: <NotificacoesTab />,
  seguranca: <SegurancaTab />,
};

export default function ConfiguracoesPage() {
  const [activeTab, setActiveTab] = useState("perfil");
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-2xl font-bold text-white">Configurações</h1>
        <p className="mt-1 text-slate-400">Gerencie sua conta e preferências.</p>
        <div className="mt-6 sm:mt-8 flex flex-col gap-4 lg:flex-row lg:gap-8">
          {/* Tabs — horizontal scroll on mobile, vertical column on desktop */}
          <nav className="flex flex-row gap-1 overflow-x-auto pb-1 lg:w-44 lg:shrink-0 lg:flex-col lg:space-y-1 lg:overflow-visible lg:pb-0 scrollbar-hide">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`flex shrink-0 items-center gap-2.5 whitespace-nowrap rounded-xl px-3 py-2.5 text-sm font-medium transition lg:w-full ${
                  activeTab === t.id
                    ? "bg-violet-500/15 text-violet-300"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <t.icon className="size-4 shrink-0" />
                {t.label}
                {activeTab === t.id && <ChevronRight className="ml-auto hidden size-3.5 lg:block" />}
              </button>
            ))}
          </nav>
          {/* Right content */}
          <div className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6">
            {tabContent[activeTab]}
          </div>
        </div>
      </div>
    </div>
  );
}
