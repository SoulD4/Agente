"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Search,
  Phone,
  Bot,
  UserCheck,
  MoreVertical,
  X,
  Filter,
  ArrowLeft,
  Loader2,
  MessageCircle,
  CheckCircle2,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type DbStatus = "OPEN" | "CLOSED" | "PENDING";
type FilterType = "Todas" | "Ativas" | "Aguardando" | "Finalizadas";

interface ConvSummary {
  id: string;
  contactName: string | null;
  contactPhone: string;
  status: DbStatus;
  humanTakeover: boolean;
  updatedAt: string;
  createdAt: string;
  agent: { id: string; name: string } | null;
  lastMessage: { content: string; role: string; createdAt: string } | null;
}

interface DbMessage {
  id: string;
  conversationId: string;
  role: "USER" | "ASSISTANT" | "SYSTEM";
  content: string;
  createdAt: string;
}

interface ConvDetail extends ConvSummary {
  messages: DbMessage[];
}

// ─── Status helpers ───────────────────────────────────────────────────────────

function displayStatus(conv: ConvSummary): "Ativa" | "Aguardando" | "Finalizada" {
  if (conv.status === "CLOSED") return "Finalizada";
  if (conv.humanTakeover || conv.status === "PENDING") return "Aguardando";
  return "Ativa";
}

function matchesFilter(conv: ConvSummary, filter: FilterType): boolean {
  if (filter === "Todas") return true;
  const ds = displayStatus(conv);
  if (filter === "Ativas") return ds === "Ativa";
  if (filter === "Aguardando") return ds === "Aguardando";
  return ds === "Finalizada";
}

function timeAgo(isoDate: string): string {
  const diff = Date.now() - new Date(isoDate).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "agora";
  if (mins < 60) return `${mins}min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Ontem";
  return `${days}d`;
}

function initials(name: string | null, phone: string): string {
  if (name) {
    const parts = name.trim().split(" ");
    return parts.length > 1
      ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      : name.slice(0, 2).toUpperCase();
  }
  return phone.slice(-2);
}

const AVATAR_COLORS = [
  "from-violet-500 to-purple-700",
  "from-blue-500 to-blue-700",
  "from-emerald-500 to-teal-600",
  "from-amber-500 to-orange-600",
  "from-pink-500 to-rose-600",
  "from-cyan-500 to-blue-600",
  "from-indigo-500 to-violet-700",
  "from-red-500 to-rose-700",
];

function avatarColor(id: string): string {
  let hash = 0;
  for (const ch of id) hash = (hash * 31 + ch.charCodeAt(0)) & 0xffff;
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

// ─── Status badge ─────────────────────────────────────────────────────────────

function StatusBadge({ conv }: { conv: ConvSummary }) {
  const status = displayStatus(conv);
  if (status === "Ativa")
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_4px_#34d399]" />
        Ativa
      </span>
    );
  if (status === "Aguardando")
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/25">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
        {conv.humanTakeover ? "Humano" : "Aguardando"}
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/8 text-white/40 border border-white/10">
      <span className="w-1.5 h-1.5 rounded-full bg-white/30" />
      Finalizada
    </span>
  );
}

// ─── Conversation list item ───────────────────────────────────────────────────

function ConvItem({
  conv,
  selected,
  onClick,
}: {
  conv: ConvSummary;
  selected: boolean;
  onClick: () => void;
}) {
  const ini = initials(conv.contactName, conv.contactPhone);
  const color = avatarColor(conv.id);
  const preview = conv.lastMessage?.content ?? conv.contactPhone;
  const when = timeAgo(conv.updatedAt);

  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-3.5 flex items-start gap-3 border-b border-white/[0.06] transition-all duration-150 ${
        selected ? "bg-violet-500/10 border-l-2 border-l-violet-500" : "hover:bg-white/[0.04]"
      }`}
    >
      <div
        className={`w-10 h-10 rounded-full bg-gradient-to-br ${color} flex items-center justify-center shrink-0 shadow-md`}
      >
        <span className="text-white text-xs font-bold">{ini}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <span className="text-white/90 text-sm font-semibold truncate pr-2">
            {conv.contactName ?? conv.contactPhone}
          </span>
          <span className="text-white/35 text-[11px] shrink-0">{when}</span>
        </div>
        <p className="text-white/45 text-xs truncate mb-1.5">{preview}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {conv.agent && (
              <span className="inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-md text-violet-400 bg-violet-500/15">
                <Bot size={9} />
                {conv.agent.name}
              </span>
            )}
          </div>
          <StatusBadge conv={conv} />
        </div>
      </div>
    </button>
  );
}

// ─── Chat bubble ─────────────────────────────────────────────────────────────

function ChatBubble({ msg }: { msg: DbMessage }) {
  const isBot = msg.role === "ASSISTANT";
  const time = new Date(msg.createdAt).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className={`flex ${isBot ? "justify-start" : "justify-end"} mb-3`}>
      {isBot && (
        <div className="w-7 h-7 rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center shrink-0 mr-2 mt-auto mb-0.5">
          <Bot size={13} className="text-violet-400" />
        </div>
      )}
      <div
        className={`max-w-[82%] sm:max-w-[72%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed break-words ${
          isBot
            ? "bg-white/8 border border-white/10 text-white/85 rounded-bl-sm"
            : "bg-[#005c4b] text-white/95 rounded-br-sm"
        }`}
      >
        <p>{msg.content}</p>
        <p className={`text-[10px] mt-1.5 ${isBot ? "text-white/30" : "text-white/40"} text-right`}>
          {time}
        </p>
      </div>
    </div>
  );
}

// ─── Empty state ─────────────────────────────────────────────────────────────

function EmptyDetail() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center p-8">
      <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
        <Bot size={28} className="text-white/20" />
      </div>
      <div>
        <p className="text-white/50 font-medium">Selecione uma conversa</p>
        <p className="text-white/25 text-sm mt-1">
          Escolha uma conversa na lista para visualizar os detalhes
        </p>
      </div>
    </div>
  );
}

// ─── No conversations ─────────────────────────────────────────────────────────

function EmptyList() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
        <MessageCircle size={28} className="text-white/20" />
      </div>
      <p className="text-white/50 font-medium">Nenhuma conversa ainda</p>
      <p className="text-white/25 text-sm mt-1">
        As conversas do WhatsApp aparecerão aqui assim que chegarem
      </p>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function ConversasPage() {
  const [conversations, setConversations] = useState<ConvSummary[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<ConvDetail | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("Todas");
  const [actionLoading, setActionLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const filters: FilterType[] = ["Todas", "Ativas", "Aguardando", "Finalizadas"];

  // Fetch conversation list
  const fetchList = useCallback(() => {
    setLoadingList(true);
    fetch("/api/conversations")
      .then((r) => r.json())
      .then((data) => {
        if (data.conversations) setConversations(data.conversations);
      })
      .catch(console.error)
      .finally(() => setLoadingList(false));
  }, []);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  // Fetch conversation detail when selected
  useEffect(() => {
    if (!selectedId) {
      setDetail(null);
      return;
    }
    setLoadingDetail(true);
    fetch(`/api/conversations/${selectedId}`)
      .then((r) => r.json())
      .then((data) => setDetail(data))
      .catch(console.error)
      .finally(() => setLoadingDetail(false));
  }, [selectedId]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [detail?.messages?.length]);

  // Apply filters
  const filtered = conversations.filter(
    (c) =>
      matchesFilter(c, activeFilter) &&
      (searchQuery.trim() === "" ||
        (c.contactName ?? "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.contactPhone.includes(searchQuery) ||
        (c.lastMessage?.content ?? "").toLowerCase().includes(searchQuery.toLowerCase())),
  );

  async function handleTakeover() {
    if (!detail) return;
    setActionLoading(true);
    const newValue = !detail.humanTakeover;
    await fetch(`/api/conversations/${detail.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ humanTakeover: newValue }),
    });
    setDetail((d) => d && { ...d, humanTakeover: newValue });
    setConversations((list) =>
      list.map((c) => (c.id === detail.id ? { ...c, humanTakeover: newValue } : c)),
    );
    setActionLoading(false);
  }

  async function handleClose() {
    if (!detail) return;
    setActionLoading(true);
    await fetch(`/api/conversations/${detail.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: detail.status === "CLOSED" ? "OPEN" : "CLOSED" }),
    });
    fetchList();
    setSelectedId(null);
    setActionLoading(false);
  }

  const showHuman = detail?.humanTakeover ?? false;

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden">

      {/* ── Left sidebar ──────────────────────────────────────────────────── */}
      <div
        className={`${
          selectedId ? "hidden lg:flex" : "flex"
        } w-full lg:w-80 shrink-0 flex-col border-r border-white/[0.08] bg-[#0d0d14]`}
      >
        {/* Search */}
        <div className="p-3 border-b border-white/[0.06]">
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2 focus-within:border-violet-500/40 transition-colors">
            <Search size={13} className="text-white/30 shrink-0" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar conversa..."
              className="flex-1 bg-transparent text-sm text-white placeholder:text-white/30 focus:outline-none"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")}>
                <X size={12} className="text-white/30 hover:text-white/60 transition-colors" />
              </button>
            )}
          </div>
        </div>

        {/* Filter chips */}
        <div className="flex items-center gap-1 px-3 py-2 border-b border-white/[0.06] overflow-x-auto">
          <Filter size={11} className="text-white/25 shrink-0 mr-0.5" />
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`shrink-0 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all duration-150 ${
                activeFilter === f
                  ? "bg-violet-500/25 text-violet-300 border border-violet-500/40"
                  : "text-white/40 hover:text-white/70 hover:bg-white/5 border border-transparent"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Count */}
        <div className="px-4 py-2 border-b border-white/[0.04]">
          <p className="text-white/30 text-[11px]">
            {loadingList ? "Carregando…" : `${filtered.length} conversa${filtered.length !== 1 ? "s" : ""}`}
          </p>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto">
          {loadingList ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 size={22} className="animate-spin text-violet-400" />
            </div>
          ) : filtered.length === 0 ? (
            conversations.length === 0 ? (
              <EmptyList />
            ) : (
              <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                <p className="text-white/30 text-sm">Nenhuma conversa encontrada</p>
              </div>
            )
          ) : (
            filtered.map((conv) => (
              <ConvItem
                key={conv.id}
                conv={conv}
                selected={selectedId === conv.id}
                onClick={() => setSelectedId(conv.id)}
              />
            ))
          )}
        </div>
      </div>

      {/* ── Right panel ───────────────────────────────────────────────────── */}
      <div
        className={`${
          selectedId ? "flex" : "hidden lg:flex"
        } flex-1 flex-col bg-[#0a0a0f] min-w-0`}
      >
        {!selectedId || !detail ? (
          loadingDetail ? (
            <div className="flex-1 flex items-center justify-center">
              <Loader2 size={28} className="animate-spin text-violet-400" />
            </div>
          ) : (
            <EmptyDetail />
          )
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center justify-between gap-2 px-3 sm:px-5 py-3.5 border-b border-white/[0.08] bg-[#0d0d14] shrink-0">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <button
                  onClick={() => setSelectedId(null)}
                  className="lg:hidden w-8 h-8 rounded-xl flex items-center justify-center text-white/50 hover:text-white/80 hover:bg-white/5 transition-colors shrink-0"
                  aria-label="Voltar"
                >
                  <ArrowLeft size={18} />
                </button>
                <div
                  className={`w-9 h-9 rounded-full bg-gradient-to-br ${avatarColor(detail.id)} flex items-center justify-center shadow-md shrink-0`}
                >
                  <span className="text-white text-xs font-bold">
                    {initials(detail.contactName, detail.contactPhone)}
                  </span>
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 min-w-0">
                    <p className="text-white font-semibold text-sm truncate">
                      {detail.contactName ?? detail.contactPhone}
                    </p>
                    <StatusBadge conv={detail} />
                  </div>
                  <div className="flex items-center gap-3 mt-0.5 min-w-0">
                    <div className="flex items-center gap-1 text-white/40 text-xs min-w-0">
                      <Phone size={10} className="shrink-0" />
                      <span className="truncate">{detail.contactPhone}</span>
                    </div>
                    {detail.agent && (
                      <div className="hidden sm:flex items-center gap-1 text-white/40 text-xs shrink-0">
                        <Bot size={10} className="text-violet-400" />
                        <span className="text-violet-400/80">{detail.agent.name}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleTakeover}
                  disabled={actionLoading}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-colors disabled:opacity-50 ${
                    showHuman
                      ? "bg-violet-500/15 text-violet-400 border-violet-500/30 hover:bg-violet-500/25"
                      : "bg-amber-500/15 text-amber-400 border-amber-500/30 hover:bg-amber-500/25"
                  }`}
                >
                  {showHuman ? <CheckCircle2 size={13} /> : <UserCheck size={13} />}
                  <span className="hidden xl:inline">
                    {showHuman ? "Devolver ao bot" : "Assumir conversa"}
                  </span>
                  <span className="xl:hidden">{showHuman ? "Bot" : "Humano"}</span>
                </button>
                <button
                  onClick={handleClose}
                  disabled={actionLoading}
                  className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium text-white/50 border border-white/10 hover:bg-white/5 hover:text-white/70 transition-colors disabled:opacity-50"
                >
                  <X size={12} />
                  {detail.status === "CLOSED" ? "Reabrir" : "Finalizar"}
                </button>
                <button className="w-8 h-8 rounded-xl flex items-center justify-center text-white/35 hover:text-white/60 hover:bg-white/5 transition-colors border border-white/10 shrink-0">
                  <MoreVertical size={15} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-3 sm:px-5 py-5">
              {detail.messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-white/25 text-sm">Nenhuma mensagem ainda</p>
                </div>
              ) : (
                detail.messages.map((msg) => <ChatBubble key={msg.id} msg={msg} />)
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Status bar */}
            {!showHuman && detail.status === "OPEN" && (
              <div className="mx-3 sm:mx-5 mb-2 px-3 py-1.5 rounded-xl bg-violet-500/8 border border-violet-500/20 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse shadow-[0_0_6px_#a78bfa]" />
                <p className="text-violet-400/80 text-[11px] font-medium">
                  Agente respondendo automaticamente
                </p>
              </div>
            )}
            {showHuman && (
              <div className="mx-3 sm:mx-5 mb-2 px-3 py-1.5 rounded-xl bg-amber-500/8 border border-amber-500/20 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                <p className="text-amber-400/80 text-[11px] font-medium">
                  Atendimento humano ativo — bot pausado
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
