"use client";

import { useState } from "react";
import {
  Upload,
  FileText,
  HelpCircle,
  Link,
  Trash2,
  Plus,
  CheckCircle2,
  Loader2,
  RefreshCw,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

type UploadTab = "documentos" | "faq" | "links";

interface DocItem {
  id: string;
  name: string;
  size: string;
  date: string;
  status: "Indexado" | "Processando";
}

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

interface LinkItem {
  id: string;
  url: string;
  label: string;
  status: "Indexado" | "Processando";
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_DOCS: DocItem[] = [
  {
    id: "d1",
    name: "catalogo-produtos-2024.pdf",
    size: "2.4 MB",
    date: "12 jun 2025",
    status: "Indexado",
  },
  {
    id: "d2",
    name: "politica-de-devolucao.docx",
    size: "340 KB",
    date: "10 jun 2025",
    status: "Indexado",
  },
  {
    id: "d3",
    name: "tabela-precos-junho.xlsx",
    size: "890 KB",
    date: "15 jun 2025",
    status: "Processando",
  },
];

const MOCK_FAQS: FaqItem[] = [
  {
    id: "f1",
    question: "Qual é o prazo de entrega?",
    answer:
      "O prazo padrão é de 3 a 7 dias úteis para todo o Brasil, variando conforme a região.",
  },
  {
    id: "f2",
    question: "Vocês aceitam devolução?",
    answer:
      "Sim, aceitamos devoluções em até 30 dias após a compra, conforme o Código de Defesa do Consumidor.",
  },
  {
    id: "f3",
    question: "Como rastrear meu pedido?",
    answer:
      "Após a confirmação do envio, você receberá um código de rastreio por e-mail ou WhatsApp.",
  },
  {
    id: "f4",
    question: "Quais formas de pagamento são aceitas?",
    answer:
      "Aceitamos Pix, cartão de crédito (até 12x), débito e boleto bancário.",
  },
];

const MOCK_LINKS: LinkItem[] = [
  {
    id: "l1",
    url: "https://zaia.com.br/ajuda",
    label: "zaia.com.br/ajuda",
    status: "Indexado",
  },
  {
    id: "l2",
    url: "https://zaia.com.br/politicas",
    label: "zaia.com.br/politicas",
    status: "Processando",
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: "Indexado" | "Processando" }) {
  if (status === "Indexado") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
        <CheckCircle2 size={11} />
        Indexado
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-500/15 text-amber-400 border border-amber-500/30">
      <Loader2 size={11} className="animate-spin" />
      Processando
    </span>
  );
}

// ── Documentos tab ────────────────────────────────────────────────────────────

function DocumentosTab() {
  const [docs, setDocs] = useState<DocItem[]>(MOCK_DOCS);
  const [dragging, setDragging] = useState(false);

  function removeDoc(id: string) {
    setDocs((prev) => prev.filter((d) => d.id !== id));
  }

  return (
    <div className="space-y-5">
      {/* Drop zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
        }}
        className={`border-2 border-dashed rounded-2xl p-6 sm:p-10 flex flex-col items-center justify-center gap-3 transition-all duration-200 cursor-pointer
          ${
            dragging
              ? "border-violet-500/60 bg-violet-500/8"
              : "border-white/15 hover:border-white/25 hover:bg-white/3"
          }`}
      >
        <div className="w-12 h-12 rounded-xl bg-violet-500/15 flex items-center justify-center">
          <Upload size={22} className="text-violet-400" />
        </div>
        <div className="text-center">
          <p className="text-white/80 font-medium text-sm sm:text-base">
            Arraste PDFs, DOCs, TXTs ou XLSXs
          </p>
          <p className="text-white/40 text-sm mt-1">
            ou{" "}
            <span className="text-violet-400 cursor-pointer hover:text-violet-300">
              clique para selecionar
            </span>{" "}
            · até 50 MB por arquivo
          </p>
        </div>
      </div>

      {/* File list */}
      {docs.length > 0 && (
        <div className="space-y-2">
          <p className="text-white/40 text-xs uppercase tracking-wider font-medium px-1">
            Arquivos enviados
          </p>
          {docs.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3 group"
            >
              <div className="w-9 h-9 rounded-lg bg-blue-500/15 flex items-center justify-center shrink-0">
                <FileText size={16} className="text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white/90 text-sm font-medium truncate">
                  {doc.name}
                </p>
                <p className="text-white/40 text-xs mt-0.5 truncate">
                  <span className="hidden sm:inline">{doc.size} · {doc.date}</span>
                  <span className="sm:hidden">{doc.size}</span>
                </p>
              </div>
              <div className="shrink-0">
                <StatusBadge status={doc.status} />
              </div>
              <button
                onClick={() => removeDoc(doc.id)}
                className="ml-2 shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-all opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── FAQ tab ───────────────────────────────────────────────────────────────────

function FaqTab() {
  const [faqs, setFaqs] = useState<FaqItem[]>(MOCK_FAQS);
  const [openIds, setOpenIds] = useState<Set<string>>(new Set());
  const [formOpen, setFormOpen] = useState(false);
  const [newQ, setNewQ] = useState("");
  const [newA, setNewA] = useState("");

  function toggleOpen(id: string) {
    setOpenIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function removeFaq(id: string) {
    setFaqs((prev) => prev.filter((f) => f.id !== id));
  }

  function saveFaq() {
    if (!newQ.trim() || !newA.trim()) return;
    setFaqs((prev) => [
      ...prev,
      { id: `f${Date.now()}`, question: newQ.trim(), answer: newA.trim() },
    ]);
    setNewQ("");
    setNewA("");
    setFormOpen(false);
  }

  return (
    <div className="space-y-3">
      {faqs.map((faq) => {
        const isOpen = openIds.has(faq.id);
        return (
          <div
            key={faq.id}
            className="bg-white/5 border border-white/10 rounded-xl overflow-hidden group"
          >
            <button
              onClick={() => toggleOpen(faq.id)}
              className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/3 transition-colors"
            >
              <div className="w-7 h-7 rounded-lg bg-violet-500/15 flex items-center justify-center shrink-0">
                <HelpCircle size={14} className="text-violet-400" />
              </div>
              <span className="flex-1 text-white/90 text-sm font-medium">
                {faq.question}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFaq(faq.id);
                  }}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-all opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                >
                  <Trash2 size={12} />
                </button>
                {isOpen ? (
                  <ChevronDown size={14} className="text-white/40" />
                ) : (
                  <ChevronRight size={14} className="text-white/40" />
                )}
              </div>
            </button>
            {isOpen && (
              <div className="px-4 pb-4 pt-0 border-t border-white/8">
                <p className="text-white/60 text-sm leading-relaxed mt-3">
                  {faq.answer}
                </p>
              </div>
            )}
          </div>
        );
      })}

      {/* Inline add form */}
      {formOpen ? (
        <div className="bg-white/5 border border-violet-500/30 rounded-xl p-4 space-y-3">
          <p className="text-white/70 text-sm font-medium">Nova pergunta</p>
          <input
            value={newQ}
            onChange={(e) => setNewQ(e.target.value)}
            placeholder="Pergunta..."
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-violet-500/50 transition-colors"
          />
          <textarea
            value={newA}
            onChange={(e) => setNewA(e.target.value)}
            placeholder="Resposta..."
            rows={3}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-violet-500/50 transition-colors resize-none"
          />
          <div className="flex items-center gap-2">
            <button
              onClick={saveFaq}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Salvar
            </button>
            <button
              onClick={() => {
                setFormOpen(false);
                setNewQ("");
                setNewA("");
              }}
              className="px-4 py-2 rounded-xl bg-white/5 text-white/60 text-sm hover:bg-white/10 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setFormOpen(true)}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-dashed border-white/15 text-white/50 text-sm hover:border-violet-500/40 hover:text-violet-400 hover:bg-violet-500/5 transition-all"
        >
          <Plus size={15} />
          Adicionar pergunta
        </button>
      )}
    </div>
  );
}

// ── Links tab ─────────────────────────────────────────────────────────────────

function LinksTab() {
  const [links, setLinks] = useState<LinkItem[]>(MOCK_LINKS);
  const [urlInput, setUrlInput] = useState("");

  function addLink() {
    const val = urlInput.trim();
    if (!val) return;
    const url = val.startsWith("http") ? val : `https://${val}`;
    const label = url.replace(/^https?:\/\//, "");
    setLinks((prev) => [
      ...prev,
      { id: `l${Date.now()}`, url, label, status: "Processando" },
    ]);
    setUrlInput("");
  }

  function removeLink(id: string) {
    setLinks((prev) => prev.filter((l) => l.id !== id));
  }

  return (
    <div className="space-y-5">
      {/* URL input */}
      <div className="flex gap-2">
        <div className="flex-1 flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 focus-within:border-violet-500/50 transition-colors">
          <Link size={14} className="text-white/30 shrink-0" />
          <input
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addLink()}
            placeholder="https://seusite.com.br/pagina"
            className="flex-1 bg-transparent text-sm text-white placeholder:text-white/30 focus:outline-none"
          />
        </div>
        <button
          onClick={addLink}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white text-sm font-medium hover:opacity-90 transition-opacity shrink-0"
        >
          Adicionar
        </button>
      </div>

      {/* Links list */}
      <div className="space-y-2">
        {links.map((link) => (
          <div
            key={link.id}
            className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3 group"
          >
            <div className="w-9 h-9 rounded-lg bg-blue-500/15 flex items-center justify-center shrink-0">
              <Link size={15} className="text-blue-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white/90 text-sm font-medium truncate">
                {link.label}
              </p>
              <p className="text-white/40 text-xs mt-0.5 truncate">{link.url}</p>
            </div>
            <div className="shrink-0">
              <StatusBadge status={link.status} />
            </div>
            <button
              onClick={() => removeLink(link.id)}
              className="ml-2 shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-all opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function TreinamentoPage() {
  const [activeTab, setActiveTab] = useState<UploadTab>("documentos");

  const tabs: { id: UploadTab; label: string; icon: React.ReactNode }[] = [
    {
      id: "documentos",
      label: "Documentos",
      icon: <FileText size={15} />,
    },
    {
      id: "faq",
      label: "FAQ",
      icon: <HelpCircle size={15} />,
    },
    {
      id: "links",
      label: "Links",
      icon: <Link size={15} />,
    },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      {/* ── Header row ───────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Base de Conhecimento</h1>
          <p className="text-white/40 text-sm mt-1">
            Gerencie os documentos e informações que seus agentes utilizam
          </p>
        </div>
        <button className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-violet-500/20 self-start sm:self-auto">
          <Plus size={16} />
          Adicionar documento
        </button>
      </div>

      {/* ── Agent selector ───────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
        <div className="relative">
          <button className="flex items-center gap-2.5 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white hover:bg-white/8 hover:border-white/20 transition-all">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-violet-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold">
              S
            </div>
            <span className="text-sm font-medium">Sofia - Vendas</span>
            <ChevronDown size={14} className="text-white/40 ml-1" />
          </button>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-white/40">
          <RefreshCw size={11} className="text-emerald-400" />
          <span>
            <span className="text-white/60">145 fragmentos indexados</span>
            {" · "}Atualizado há 2h
          </span>
        </div>
      </div>

      {/* ── Upload / Knowledge card ──────────────────────────────────────── */}
      <div className="bg-white/5 border border-white/10 backdrop-blur rounded-2xl p-4 sm:p-6">
        <h2 className="text-white font-semibold mb-5">Adicionar conhecimento</h2>

        {/* Tabs */}
        <div className="flex gap-1 bg-white/5 rounded-xl p-1 mb-6 w-full sm:w-fit overflow-x-auto whitespace-nowrap">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex shrink-0 items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150
                ${
                  activeTab === tab.id
                    ? "bg-violet-600/90 text-white shadow shadow-violet-500/30"
                    : "text-white/50 hover:text-white/80 hover:bg-white/5"
                }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === "documentos" && <DocumentosTab />}
        {activeTab === "faq" && <FaqTab />}
        {activeTab === "links" && <LinksTab />}
      </div>

      {/* ── Stats row ────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            icon: <FileText size={18} />,
            label: "Documentos",
            value: "8",
            sub: "arquivos",
            iconBg: "bg-blue-500/15",
            iconColor: "text-blue-400",
          },
          {
            icon: <HelpCircle size={18} />,
            label: "FAQs",
            value: "23",
            sub: "perguntas",
            iconBg: "bg-violet-500/15",
            iconColor: "text-violet-400",
          },
          {
            icon: <Link size={18} />,
            label: "Links",
            value: "4",
            sub: "URLs",
            iconBg: "bg-emerald-500/15",
            iconColor: "text-emerald-400",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white/5 border border-white/10 backdrop-blur rounded-2xl p-5 flex items-center gap-4"
          >
            <div
              className={`w-10 h-10 rounded-xl ${stat.iconBg} flex items-center justify-center shrink-0`}
            >
              <span className={stat.iconColor}>{stat.icon}</span>
            </div>
            <div>
              <p className="text-white/50 text-xs mb-0.5">{stat.label}</p>
              <p className="text-white font-bold text-xl leading-none">
                {stat.value}{" "}
                <span className="text-white/40 text-sm font-normal">
                  {stat.sub}
                </span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
