"use client";

import { useState } from "react";
import {
  Search,
  Phone,
  Bot,
  UserCheck,
  Send,
  MoreVertical,
  X,
  Filter,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type ConvStatus = "Ativa" | "Aguardando" | "Finalizada";
type FilterType = "Todas" | "Ativas" | "Aguardando" | "Finalizadas";

interface Conversation {
  id: string;
  name: string;
  phone: string;
  initials: string;
  avatarColor: string;
  lastMessage: string;
  time: string;
  unread: number;
  agentName: string;
  agentColor: string;
  status: ConvStatus;
}

interface ChatMessage {
  id: string;
  role: "bot" | "user";
  text: string;
  time: string;
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: "c1",
    name: "Camila Ferreira",
    phone: "+55 11 99201-3344",
    initials: "CF",
    avatarColor: "from-violet-500 to-purple-700",
    lastMessage: "Oi! Quero saber mais sobre o plano Premium, por favor.",
    time: "agora",
    unread: 2,
    agentName: "Sofia",
    agentColor: "text-violet-400 bg-violet-500/15",
    status: "Ativa",
  },
  {
    id: "c2",
    name: "Rafael Mendes",
    phone: "+55 21 98877-5566",
    initials: "RM",
    avatarColor: "from-blue-500 to-blue-700",
    lastMessage: "Meu pedido #4521 ainda não chegou, pode verificar?",
    time: "2min",
    unread: 1,
    agentName: "Max",
    agentColor: "text-blue-400 bg-blue-500/15",
    status: "Aguardando",
  },
  {
    id: "c3",
    name: "Juliana Costa",
    phone: "+55 31 97766-2211",
    initials: "JC",
    avatarColor: "from-emerald-500 to-teal-600",
    lastMessage: "Perfeito, obrigada pela ajuda! Vou efetuar o pagamento agora.",
    time: "15min",
    unread: 0,
    agentName: "Sofia",
    agentColor: "text-violet-400 bg-violet-500/15",
    status: "Ativa",
  },
  {
    id: "c4",
    name: "Marcos Oliveira",
    phone: "+55 85 96655-4433",
    initials: "MO",
    avatarColor: "from-amber-500 to-orange-600",
    lastMessage: "Qual é a taxa de juros do parcelamento em 12x?",
    time: "1h",
    unread: 0,
    agentName: "Sofia",
    agentColor: "text-violet-400 bg-violet-500/15",
    status: "Ativa",
  },
  {
    id: "c5",
    name: "Beatriz Santos",
    phone: "+55 11 95544-8877",
    initials: "BS",
    avatarColor: "from-pink-500 to-rose-600",
    lastMessage: "Preciso cancelar meu plano, como faço isso?",
    time: "Ontem",
    unread: 0,
    agentName: "Max",
    agentColor: "text-blue-400 bg-blue-500/15",
    status: "Aguardando",
  },
  {
    id: "c6",
    name: "Diego Almeida",
    phone: "+55 41 94433-6655",
    initials: "DA",
    avatarColor: "from-cyan-500 to-blue-600",
    lastMessage: "Obrigado! Já recebi o código de rastreio.",
    time: "Ontem",
    unread: 0,
    agentName: "Max",
    agentColor: "text-blue-400 bg-blue-500/15",
    status: "Finalizada",
  },
  {
    id: "c7",
    name: "Larissa Nunes",
    phone: "+55 62 93322-7788",
    initials: "LN",
    avatarColor: "from-indigo-500 to-violet-700",
    lastMessage: "Consigo trocar o produto por outro modelo?",
    time: "Ontem",
    unread: 3,
    agentName: "Sofia",
    agentColor: "text-violet-400 bg-violet-500/15",
    status: "Ativa",
  },
  {
    id: "c8",
    name: "Carlos Rodrigues",
    phone: "+55 11 92211-9900",
    initials: "CR",
    avatarColor: "from-red-500 to-rose-700",
    lastMessage: "Atendimento excelente! Muito obrigado.",
    time: "Ontem",
    unread: 0,
    agentName: "Max",
    agentColor: "text-blue-400 bg-blue-500/15",
    status: "Finalizada",
  },
  {
    id: "c9",
    name: "Fernanda Lima",
    phone: "+55 71 91100-2233",
    initials: "FL",
    avatarColor: "from-fuchsia-500 to-pink-700",
    lastMessage: "Quando vocês têm promoção de Black Friday?",
    time: "Ontem",
    unread: 0,
    agentName: "Sofia",
    agentColor: "text-violet-400 bg-violet-500/15",
    status: "Aguardando",
  },
  {
    id: "c10",
    name: "André Moreira",
    phone: "+55 51 90099-4455",
    initials: "AM",
    avatarColor: "from-teal-500 to-emerald-700",
    lastMessage: "O boleto venceu, consigo pagar com Pix mesmo assim?",
    time: "Ontem",
    unread: 1,
    agentName: "Sofia",
    agentColor: "text-violet-400 bg-violet-500/15",
    status: "Ativa",
  },
];

const MOCK_MESSAGES: ChatMessage[] = [
  {
    id: "m1",
    role: "bot",
    text: "Olá! Sou a Sofia, assistente virtual da Zaia. Como posso te ajudar hoje? 😊",
    time: "14:02",
  },
  {
    id: "m2",
    role: "user",
    text: "Oi! Quero saber mais sobre o plano Premium, por favor.",
    time: "14:03",
  },
  {
    id: "m3",
    role: "bot",
    text: "Claro! O Plano Premium inclui atendimento ilimitado via WhatsApp, inteligência artificial treinada com seus dados, relatórios em tempo real e suporte prioritário. O valor é R$ 297/mês.",
    time: "14:03",
  },
  {
    id: "m4",
    role: "user",
    text: "E tem integração com sistemas de CRM?",
    time: "14:04",
  },
  {
    id: "m5",
    role: "bot",
    text: "Sim! Temos integrações nativas com HubSpot, RD Station, Salesforce e via Zapier você conecta com centenas de outras ferramentas.",
    time: "14:04",
  },
  {
    id: "m6",
    role: "user",
    text: "Que ótimo! E o contrato é mensal ou anual?",
    time: "14:05",
  },
  {
    id: "m7",
    role: "bot",
    text: "Você pode escolher! Mensal sem fidelidade, ou anual com 20% de desconto — fica R$ 237,60/mês no plano anual. Qual prefere?",
    time: "14:05",
  },
  {
    id: "m8",
    role: "user",
    text: "Vou pensar e te retorno. Muito obrigada!",
    time: "14:06",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function filterConvs(list: Conversation[], filter: FilterType, q: string): Conversation[] {
  let result = list;
  if (filter === "Ativas") result = result.filter((c) => c.status === "Ativa");
  else if (filter === "Aguardando") result = result.filter((c) => c.status === "Aguardando");
  else if (filter === "Finalizadas") result = result.filter((c) => c.status === "Finalizada");
  if (q.trim()) {
    const lower = q.toLowerCase();
    result = result.filter(
      (c) =>
        c.name.toLowerCase().includes(lower) ||
        c.phone.includes(q) ||
        c.lastMessage.toLowerCase().includes(lower)
    );
  }
  return result;
}

// ─── Status badge (conversation) ──────────────────────────────────────────────

function ConvStatusBadge({ status }: { status: ConvStatus }) {
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
        Aguardando
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
  conv: Conversation;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-3.5 flex items-start gap-3 border-b border-white/[0.06] transition-all duration-150
        ${selected ? "bg-violet-500/10 border-l-2 border-l-violet-500" : "hover:bg-white/[0.04]"}`}
    >
      {/* Avatar */}
      <div
        className={`w-10 h-10 rounded-full bg-gradient-to-br ${conv.avatarColor} flex items-center justify-center shrink-0 shadow-md`}
      >
        <span className="text-white text-xs font-bold">{conv.initials}</span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Name + time */}
        <div className="flex items-center justify-between mb-0.5">
          <span className="text-white/90 text-sm font-semibold truncate pr-2">
            {conv.name}
          </span>
          <span className="text-white/35 text-[11px] shrink-0">{conv.time}</span>
        </div>
        {/* Message preview */}
        <p className="text-white/45 text-xs truncate mb-1.5">{conv.lastMessage}</p>
        {/* Bottom row: agent badge + unread */}
        <div className="flex items-center justify-between">
          <span
            className={`inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-md ${conv.agentColor}`}
          >
            <Bot size={9} />
            {conv.agentName}
          </span>
          {conv.unread > 0 && (
            <span className="w-4 h-4 rounded-full bg-violet-500 text-white text-[10px] font-bold flex items-center justify-center shadow-sm shadow-violet-500/40">
              {conv.unread}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

// ─── Chat bubble ─────────────────────────────────────────────────────────────

function ChatBubble({ msg }: { msg: ChatMessage }) {
  const isBot = msg.role === "bot";
  return (
    <div className={`flex ${isBot ? "justify-start" : "justify-end"} mb-3`}>
      {isBot && (
        <div className="w-7 h-7 rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center shrink-0 mr-2 mt-auto mb-0.5">
          <Bot size={13} className="text-violet-400" />
        </div>
      )}
      <div
        className={`max-w-[72%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
          isBot
            ? "bg-white/8 border border-white/10 text-white/85 rounded-bl-sm"
            : "bg-[#005c4b] text-white/95 rounded-br-sm"
        }`}
      >
        <p>{msg.text}</p>
        <p className={`text-[10px] mt-1.5 ${isBot ? "text-white/30" : "text-white/40"} text-right`}>
          {msg.time}
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

// ─── Main page ────────────────────────────────────────────────────────────────

export default function ConversasPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("Todas");
  const [messageInput, setMessageInput] = useState("");

  const filters: FilterType[] = ["Todas", "Ativas", "Aguardando", "Finalizadas"];

  const filtered = filterConvs(MOCK_CONVERSATIONS, activeFilter, searchQuery);
  const selectedConv = MOCK_CONVERSATIONS.find((c) => c.id === selectedId) ?? null;

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden">

      {/* ── Left sidebar: conversation list ──────────────────────────────── */}
      <div className="w-80 shrink-0 flex flex-col border-r border-white/[0.08] bg-[#0d0d14]">

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
        <div className="flex items-center gap-1 px-3 py-2 border-b border-white/[0.06] overflow-x-auto scrollbar-hide">
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
            {filtered.length} conversa{filtered.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Scrollable list */}
        <div className="flex-1 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
              <p className="text-white/30 text-sm">Nenhuma conversa encontrada</p>
            </div>
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

      {/* ── Right panel: conversation detail ─────────────────────────────── */}
      <div className="flex-1 flex flex-col bg-[#0a0a0f] min-w-0">
        {!selectedConv ? (
          <EmptyDetail />
        ) : (
          <>
            {/* Detail header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.08] bg-[#0d0d14] shrink-0">
              <div className="flex items-center gap-3">
                {/* Avatar */}
                <div
                  className={`w-9 h-9 rounded-full bg-gradient-to-br ${selectedConv.avatarColor} flex items-center justify-center shadow-md`}
                >
                  <span className="text-white text-xs font-bold">{selectedConv.initials}</span>
                </div>
                {/* Info */}
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-white font-semibold text-sm">{selectedConv.name}</p>
                    <ConvStatusBadge status={selectedConv.status} />
                  </div>
                  <div className="flex items-center gap-3 mt-0.5">
                    <div className="flex items-center gap-1 text-white/40 text-xs">
                      <Phone size={10} />
                      <span>{selectedConv.phone}</span>
                    </div>
                    <div className="flex items-center gap-1 text-white/40 text-xs">
                      <Bot size={10} className="text-violet-400" />
                      <span className="text-violet-400/80">{selectedConv.agentName}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30 hover:bg-amber-500/25 transition-colors">
                  <UserCheck size={13} />
                  Transferir para humano
                </button>
                <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium text-white/50 border border-white/10 hover:bg-white/5 hover:text-white/70 transition-colors">
                  <X size={12} />
                  Finalizar
                </button>
                <button className="w-8 h-8 rounded-xl flex items-center justify-center text-white/35 hover:text-white/60 hover:bg-white/5 transition-colors border border-white/10">
                  <MoreVertical size={15} />
                </button>
              </div>
            </div>

            {/* Messages area */}
            <div className="flex-1 overflow-y-auto px-5 py-5">
              {MOCK_MESSAGES.map((msg) => (
                <ChatBubble key={msg.id} msg={msg} />
              ))}
            </div>

            {/* Monitoring notice */}
            <div className="mx-5 mb-2 px-3 py-1.5 rounded-xl bg-violet-500/8 border border-violet-500/20 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse shadow-[0_0_6px_#a78bfa]" />
              <p className="text-violet-400/80 text-[11px] font-medium">
                Monitorando — agente está respondendo
              </p>
            </div>

            {/* Input bar */}
            <div className="px-5 pb-5 shrink-0">
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 focus-within:border-violet-500/40 transition-colors">
                <input
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      setMessageInput("");
                    }
                  }}
                  placeholder="Digite uma mensagem..."
                  className="flex-1 bg-transparent text-sm text-white placeholder:text-white/30 focus:outline-none"
                />
                <button
                  onClick={() => setMessageInput("")}
                  className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-150 shrink-0 ${
                    messageInput.trim()
                      ? "bg-gradient-to-br from-violet-600 to-blue-600 text-white hover:opacity-90 shadow-sm shadow-violet-500/30"
                      : "text-white/20 cursor-default"
                  }`}
                >
                  <Send size={14} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
