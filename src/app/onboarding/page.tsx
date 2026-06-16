"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/brand/logo";
import {
  Building2,
  Target,
  Clock,
  ShoppingBag,
  HelpCircle,
  Bot,
  BookOpen,
  TestTube,
  Rocket,
  Plus,
  Trash2,
  Upload,
  Send,
  Check,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  isPlaceholder?: boolean;
}

interface DaySchedule {
  enabled: boolean;
  start: string;
  end: string;
}

interface Schedule {
  seg: DaySchedule;
  ter: DaySchedule;
  qua: DaySchedule;
  qui: DaySchedule;
  sex: DaySchedule;
  sab: DaySchedule;
  dom: DaySchedule;
  allDay: boolean;
}

interface ChatMessage {
  from: "user" | "bot";
  text: string;
}

interface FormData {
  // Step 1
  companyName: string;
  segment: string;
  phone: string;
  website: string;
  // Step 2
  niche: string;
  // Step 3
  objectives: string[];
  // Step 4
  schedule: Schedule;
  // Step 5
  products: Product[];
  // Step 6
  faqs: FAQ[];
  // Step 7
  agentName: string;
  tone: string;
  greeting: string;
  // Step 8
  fakeFiles: string[];
  additionalInfo: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const STEPS = [
  { label: "Dados da empresa", icon: Building2 },
  { label: "Nicho", icon: Target },
  { label: "Objetivos", icon: Target },
  { label: "Horários", icon: Clock },
  { label: "Produtos", icon: ShoppingBag },
  { label: "FAQ", icon: HelpCircle },
  { label: "Agente", icon: Bot },
  { label: "Treinamento", icon: BookOpen },
  { label: "Testar", icon: TestTube },
  { label: "Publicar", icon: Rocket },
];

const NICHES = [
  "E-commerce",
  "Clínica/Saúde",
  "Imobiliária",
  "Restaurante",
  "Educação",
  "Academia/Fitness",
  "Advocacia",
  "Beleza/Estética",
  "Outro",
];

const OBJECTIVES = [
  "Gerar leads",
  "Qualificar clientes",
  "Agendar consultas",
  "Responder dúvidas",
  "Fazer cobranças",
  "Recuperar clientes",
];

const SEGMENTS = [
  "Varejo",
  "Serviços",
  "Saúde",
  "Imóveis",
  "Educação",
  "Outro",
];

const WEEKDAYS: { key: keyof Omit<Schedule, "allDay">; label: string }[] = [
  { key: "seg", label: "Segunda-feira" },
  { key: "ter", label: "Terça-feira" },
  { key: "qua", label: "Quarta-feira" },
  { key: "qui", label: "Quinta-feira" },
  { key: "sex", label: "Sexta-feira" },
  { key: "sab", label: "Sábado" },
  { key: "dom", label: "Domingo" },
];

const DEFAULT_FAQS: FAQ[] = [
  {
    id: "ph1",
    question: "Quais são os horários de atendimento?",
    answer: "Atendemos de segunda a sexta, das 8h às 18h.",
    isPlaceholder: true,
  },
  {
    id: "ph2",
    question: "Como posso entrar em contato?",
    answer: "Você pode nos contatar via WhatsApp, e-mail ou telefone.",
    isPlaceholder: true,
  },
];

const BOT_RESPONSES = [
  "Olá! Obrigado por entrar em contato. Como posso te ajudar hoje?",
  "Entendi! Posso te auxiliar com isso. Poderia me fornecer mais detalhes?",
  "Perfeito! Vou verificar essas informações para você agora mesmo.",
  "Ótima pergunta! Temos justamente a solução que você precisa.",
  "Claro! Posso te ajudar com isso. Aguarde um momento.",
];

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Toggle({
  enabled,
  onChange,
}: {
  enabled: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 focus:outline-none ${
        enabled ? "bg-violet-600" : "bg-white/10"
      }`}
    >
      <span
        className={`inline-block h-5 w-5 translate-y-0.5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
          enabled ? "translate-x-5.5" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

// ─── Step Components ──────────────────────────────────────────────────────────

function Step1({
  data,
  setData,
}: {
  data: FormData;
  setData: (d: Partial<FormData>) => void;
}) {
  return (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1.5">
          Nome da empresa <span className="text-violet-400">*</span>
        </label>
        <input
          type="text"
          value={data.companyName}
          onChange={(e) => setData({ companyName: e.target.value })}
          placeholder="Ex: Clínica Bem Estar"
          className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50 transition"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1.5">
          Segmento <span className="text-violet-400">*</span>
        </label>
        <select
          value={data.segment}
          onChange={(e) => setData({ segment: e.target.value })}
          className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50 transition appearance-none cursor-pointer"
        >
          <option value="" className="bg-[#111118]">
            Selecione um segmento
          </option>
          {SEGMENTS.map((s) => (
            <option key={s} value={s} className="bg-[#111118]">
              {s}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1.5">
          Telefone / WhatsApp <span className="text-violet-400">*</span>
        </label>
        <input
          type="tel"
          value={data.phone}
          onChange={(e) => setData({ phone: e.target.value })}
          placeholder="(11) 99999-9999"
          className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50 transition"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1.5">
          Site{" "}
          <span className="text-slate-500 text-xs font-normal">(opcional)</span>
        </label>
        <input
          type="url"
          value={data.website}
          onChange={(e) => setData({ website: e.target.value })}
          placeholder="https://suaempresa.com.br"
          className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50 transition"
        />
      </div>
    </div>
  );
}

function Step2({
  data,
  setData,
}: {
  data: FormData;
  setData: (d: Partial<FormData>) => void;
}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {NICHES.map((niche) => {
        const selected = data.niche === niche;
        return (
          <button
            key={niche}
            type="button"
            onClick={() => setData({ niche })}
            className={`relative rounded-xl border p-4 text-sm font-medium text-center transition-all duration-200 cursor-pointer ${
              selected
                ? "border-violet-500 bg-violet-500/15 text-white ring-1 ring-violet-500/40"
                : "border-white/10 bg-white/5 text-slate-300 hover:border-white/20 hover:bg-white/8 hover:text-white"
            }`}
          >
            {selected && (
              <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-violet-500 flex items-center justify-center">
                <Check className="w-2.5 h-2.5 text-white" />
              </span>
            )}
            {niche}
          </button>
        );
      })}
    </div>
  );
}

function Step3({
  data,
  setData,
}: {
  data: FormData;
  setData: (d: Partial<FormData>) => void;
}) {
  const toggle = (obj: string) => {
    const current = data.objectives;
    const next = current.includes(obj)
      ? current.filter((o) => o !== obj)
      : [...current, obj];
    setData({ objectives: next });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {OBJECTIVES.map((obj) => {
        const selected = data.objectives.includes(obj);
        return (
          <button
            key={obj}
            type="button"
            onClick={() => toggle(obj)}
            className={`relative rounded-xl border p-4 text-sm font-medium text-left transition-all duration-200 cursor-pointer ${
              selected
                ? "border-violet-500 bg-violet-500/15 text-white ring-1 ring-violet-500/40"
                : "border-white/10 bg-white/5 text-slate-300 hover:border-white/20 hover:bg-white/8 hover:text-white"
            }`}
          >
            {selected && (
              <span className="absolute top-2.5 right-2.5 w-4 h-4 rounded-full bg-violet-500 flex items-center justify-center">
                <Check className="w-2.5 h-2.5 text-white" />
              </span>
            )}
            {obj}
          </button>
        );
      })}
    </div>
  );
}

function Step4({
  data,
  setData,
}: {
  data: FormData;
  setData: (d: Partial<FormData>) => void;
}) {
  const updateDay = (
    key: keyof Omit<Schedule, "allDay">,
    field: keyof DaySchedule,
    value: boolean | string
  ) => {
    setData({
      schedule: {
        ...data.schedule,
        [key]: { ...data.schedule[key], [field]: value },
      },
    });
  };

  return (
    <div className="space-y-4">
      {/* 24/7 Toggle */}
      <div className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-white/5">
        <div>
          <p className="text-sm font-medium text-white">24/7 (sem restrição)</p>
          <p className="text-xs text-slate-500 mt-0.5">
            Agente disponível a qualquer hora
          </p>
        </div>
        <Toggle
          enabled={data.schedule.allDay}
          onChange={(v) =>
            setData({ schedule: { ...data.schedule, allDay: v } })
          }
        />
      </div>

      {/* Days */}
      <div
        className={`space-y-2 transition-opacity ${
          data.schedule.allDay ? "opacity-30 pointer-events-none" : "opacity-100"
        }`}
      >
        {WEEKDAYS.map(({ key, label }) => {
          const day = data.schedule[key];
          return (
            <div
              key={key}
              className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-3 rounded-xl border border-white/8 bg-white/3"
            >
              <div className="flex items-center gap-3 sm:gap-4">
                <Toggle
                  enabled={day.enabled}
                  onChange={(v) => updateDay(key, "enabled", v)}
                />
                <span className="text-sm text-slate-300 sm:w-32 sm:shrink-0">
                  {label}
                </span>
              </div>
              <div
                className={`flex items-center gap-2 flex-1 transition-opacity ${
                  day.enabled ? "opacity-100" : "opacity-30 pointer-events-none"
                }`}
              >
                <input
                  type="time"
                  value={day.start}
                  onChange={(e) => updateDay(key, "start", e.target.value)}
                  className="min-w-0 flex-1 sm:flex-none rounded-lg bg-white/5 border border-white/10 px-2 sm:px-3 py-1.5 text-sm text-white focus:outline-none focus:border-violet-500 transition"
                />
                <span className="text-slate-500 text-sm shrink-0">até</span>
                <input
                  type="time"
                  value={day.end}
                  onChange={(e) => updateDay(key, "end", e.target.value)}
                  className="min-w-0 flex-1 sm:flex-none rounded-lg bg-white/5 border border-white/10 px-2 sm:px-3 py-1.5 text-sm text-white focus:outline-none focus:border-violet-500 transition"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Step5({
  data,
  setData,
}: {
  data: FormData;
  setData: (d: Partial<FormData>) => void;
}) {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState("");

  const add = () => {
    if (!name.trim()) return;
    if (data.products.length >= 20) return;
    setData({
      products: [
        ...data.products,
        { id: uid(), name: name.trim(), description: desc.trim(), price: price.trim() },
      ],
    });
    setName("");
    setDesc("");
    setPrice("");
  };

  const remove = (id: string) => {
    setData({ products: data.products.filter((p) => p.id !== id) });
  };

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-xl border border-white/10 bg-white/5 space-y-3">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nome do produto ou serviço *"
          className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500 transition"
        />
        <input
          type="text"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="Descrição breve"
          className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500 transition"
        />
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Preço (opcional)"
            className="w-full sm:flex-1 min-w-0 rounded-lg bg-white/5 border border-white/10 px-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500 transition"
          />
          <button
            type="button"
            onClick={add}
            disabled={!name.trim() || data.products.length >= 20}
            className="flex items-center justify-center gap-1.5 shrink-0 px-4 py-2.5 rounded-lg bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium transition"
          >
            <Plus className="w-4 h-4" />
            Adicionar
          </button>
        </div>
      </div>

      {data.products.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-slate-500">
            {data.products.length}/20 itens
          </p>
          {data.products.map((p) => (
            <div
              key={p.id}
              className="flex items-start justify-between p-3 rounded-xl border border-white/8 bg-white/3 gap-3"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {p.name}
                </p>
                {p.description && (
                  <p className="text-xs text-slate-400 mt-0.5 truncate">
                    {p.description}
                  </p>
                )}
                {p.price && (
                  <p className="text-xs text-violet-400 mt-0.5">{p.price}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => remove(p.id)}
                className="shrink-0 p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Step6({
  data,
  setData,
}: {
  data: FormData;
  setData: (d: Partial<FormData>) => void;
}) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const add = () => {
    if (!question.trim() || !answer.trim()) return;
    const realFaqs = data.faqs.filter((f) => !f.isPlaceholder);
    setData({
      faqs: [
        ...realFaqs,
        { id: uid(), question: question.trim(), answer: answer.trim() },
      ],
    });
    setQuestion("");
    setAnswer("");
  };

  const remove = (id: string) => {
    setData({ faqs: data.faqs.filter((f) => f.id !== id) });
  };

  const realFaqs = data.faqs.filter((f) => !f.isPlaceholder);
  const placeholders = data.faqs.filter((f) => f.isPlaceholder);

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-xl border border-white/10 bg-white/5 space-y-3">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Pergunta frequente *"
          className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500 transition"
        />
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Resposta *"
          rows={2}
          className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500 transition resize-none"
        />
        <button
          type="button"
          onClick={add}
          disabled={!question.trim() || !answer.trim()}
          className="flex items-center justify-center gap-1.5 w-full sm:w-auto px-4 py-2.5 rounded-lg bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium transition"
        >
          <Plus className="w-4 h-4" />
          Adicionar pergunta
        </button>
      </div>

      <div className="space-y-2">
        {realFaqs.map((faq) => (
          <div
            key={faq.id}
            className="flex items-start justify-between p-3 rounded-xl border border-white/8 bg-white/3 gap-3"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white break-words">{faq.question}</p>
              <p className="text-xs text-slate-400 mt-0.5 break-words">{faq.answer}</p>
            </div>
            <button
              type="button"
              onClick={() => remove(faq.id)}
              className="shrink-0 p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}

        {placeholders.map((faq) => (
          <div
            key={faq.id}
            className="flex items-start justify-between p-3 rounded-xl border border-white/5 bg-white/2 gap-3 opacity-40"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-400 italic break-words">
                {faq.question}
              </p>
              <p className="text-xs text-slate-500 mt-0.5 italic break-words">{faq.answer}</p>
            </div>
            <button
              type="button"
              onClick={() => remove(faq.id)}
              className="shrink-0 p-1.5 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function Step7({
  data,
  setData,
}: {
  data: FormData;
  setData: (d: Partial<FormData>) => void;
}) {
  const tones = ["Profissional", "Amigável", "Descontraído", "Formal"];

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1.5">
          Nome do agente <span className="text-violet-400">*</span>
        </label>
        <div className="relative">
          <input
            type="text"
            value={data.agentName}
            onChange={(e) => setData({ agentName: e.target.value })}
            placeholder="Sofia"
            className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50 transition"
          />
          {!data.agentName && (
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-500">
              Sugestão: Sofia
            </span>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Tom de voz
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {tones.map((tone) => {
            const selected = data.tone === tone;
            return (
              <label
                key={tone}
                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  selected
                    ? "border-violet-500 bg-violet-500/15"
                    : "border-white/10 bg-white/5 hover:border-white/20"
                }`}
              >
                <input
                  type="radio"
                  name="tone"
                  value={tone}
                  checked={selected}
                  onChange={() => setData({ tone })}
                  className="sr-only"
                />
                <span
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition ${
                    selected ? "border-violet-500" : "border-white/30"
                  }`}
                >
                  {selected && (
                    <span className="w-2 h-2 rounded-full bg-violet-500" />
                  )}
                </span>
                <span
                  className={`text-sm font-medium ${
                    selected ? "text-white" : "text-slate-300"
                  }`}
                >
                  {tone}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1.5">
          Apresentação inicial
        </label>
        <p className="text-xs text-slate-500 mb-2">
          O que o agente diz quando alguém entra em contato pela primeira vez
        </p>
        <textarea
          value={data.greeting}
          onChange={(e) => setData({ greeting: e.target.value })}
          rows={4}
          placeholder={`Olá! Eu sou ${data.agentName || "Sofia"}, assistente virtual. Como posso te ajudar hoje? 😊`}
          className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50 transition resize-none text-sm"
        />
      </div>
    </div>
  );
}

function Step8({
  data,
  setData,
}: {
  data: FormData;
  setData: (d: Partial<FormData>) => void;
}) {
  const [dragging, setDragging] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const files = Array.from(e.dataTransfer.files).map((f) => f.name);
    setData({ fakeFiles: [...data.fakeFiles, ...files] });
  };

  const removeFile = (name: string) => {
    setData({ fakeFiles: data.fakeFiles.filter((f) => f !== name) });
  };

  return (
    <div className="space-y-5">
      {/* Drop zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`relative flex flex-col items-center justify-center gap-3 p-6 sm:p-10 rounded-2xl border-2 border-dashed transition-all cursor-default ${
          dragging
            ? "border-violet-500 bg-violet-500/10"
            : "border-white/15 bg-white/3 hover:border-white/25"
        }`}
      >
        <div className="w-12 h-12 rounded-2xl bg-violet-500/15 flex items-center justify-center">
          <Upload className="w-6 h-6 text-violet-400" />
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-white">
            Arraste PDFs, DOCs ou TXTs aqui
          </p>
          <p className="text-xs text-slate-500 mt-1">
            ou clique para selecionar arquivos
          </p>
        </div>
        <p className="text-xs text-slate-600">Máx. 10MB por arquivo</p>
      </div>

      {data.fakeFiles.length > 0 && (
        <div className="space-y-2">
          {data.fakeFiles.map((name) => (
            <div
              key={name}
              className="flex items-center justify-between gap-3 p-3 rounded-xl border border-white/8 bg-white/3"
            >
              <div className="flex items-center gap-2 min-w-0">
                <BookOpen className="w-4 h-4 text-violet-400 shrink-0" />
                <span className="text-sm text-slate-300 truncate">{name}</span>
              </div>
              <button
                type="button"
                onClick={() => removeFile(name)}
                className="shrink-0 p-1 rounded text-slate-500 hover:text-red-400 transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1.5">
          Ou cole informações adicionais
        </label>
        <textarea
          value={data.additionalInfo}
          onChange={(e) => setData({ additionalInfo: e.target.value })}
          rows={5}
          placeholder="Cole aqui políticas de atendimento, informações sobre seus produtos, scripts de vendas, etc."
          className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/50 transition resize-none text-sm"
        />
      </div>

      <div className="p-4 rounded-xl border border-blue-500/20 bg-blue-500/5">
        <p className="text-xs font-medium text-blue-400 mb-2">
          💡 Dicas para melhor treinamento
        </p>
        <ul className="space-y-1 text-xs text-slate-400">
          <li>• Adicione políticas de atendimento e reembolso</li>
          <li>• Inclua catálogos de produtos com preços atualizados</li>
          <li>• Adicione perguntas frequentes específicas do seu negócio</li>
          <li>• Inclua scripts de vendas e objeções comuns</li>
          <li>• Adicione informações sobre formas de pagamento</li>
        </ul>
      </div>
    </div>
  );
}

function Step9({ data }: { data: FormData }) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      from: "bot",
      text:
        data.greeting ||
        `Olá! Eu sou ${data.agentName || "Sofia"}, assistente virtual de ${data.companyName || "nossa empresa"}. Como posso te ajudar hoje?`,
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const sendMessage = () => {
    if (!input.trim() || typing) return;
    const text = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { from: "user", text }]);
    setTyping(true);
    setTimeout(() => {
      const resp = BOT_RESPONSES[Math.floor(Math.random() * BOT_RESPONSES.length)];
      setMessages((prev) => [...prev, { from: "bot", text: resp }]);
      setTyping(false);
    }, 1500);
  };

  const scheduleLabel = data.schedule.allDay
    ? "24/7"
    : "Seg–Sex 08:00–18:00";

  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:h-[420px]">
      {/* Config summary */}
      <div className="w-full lg:w-48 shrink-0 space-y-3 lg:overflow-y-auto lg:pr-1">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Resumo
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-2">
          {[
            { label: "Nome", value: data.agentName || "Sofia" },
            { label: "Tom", value: data.tone || "Amigável" },
            { label: "Empresa", value: data.companyName || "—" },
            { label: "Nicho", value: data.niche || "—" },
            { label: "Horários", value: scheduleLabel },
            {
              label: "Objetivos",
              value:
                data.objectives.length > 0
                  ? data.objectives.slice(0, 2).join(", ") +
                    (data.objectives.length > 2 ? "…" : "")
                  : "—",
            },
            {
              label: "Produtos",
              value: `${data.products.length} cadastrado${data.products.length !== 1 ? "s" : ""}`,
            },
          ].map(({ label, value }) => (
            <div key={label} className="p-2.5 rounded-lg bg-white/5 border border-white/8">
              <p className="text-xs text-slate-500">{label}</p>
              <p className="text-xs font-medium text-slate-200 mt-0.5 break-words">
                {value}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Chat */}
      <div className="flex-1 flex flex-col h-[420px] lg:h-auto min-h-0 rounded-2xl border border-white/10 overflow-hidden bg-[#0d0d14]">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-white/8 bg-white/3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center shrink-0">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-medium text-white">
              {data.agentName || "Sofia"}
            </p>
            <p className="text-xs text-green-400">Online</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] break-words rounded-2xl px-3 py-2 text-sm ${
                  msg.from === "user"
                    ? "bg-violet-600 text-white rounded-br-sm"
                    : "bg-white/10 text-slate-200 rounded-bl-sm"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {typing && (
            <div className="flex justify-start">
              <div className="bg-white/10 rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1.5 items-center">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce"
                    style={{ animationDelay: `${i * 150}ms` }}
                  />
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="px-3 py-3 border-t border-white/8 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Digite uma mensagem..."
            className="flex-1 min-w-0 rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-violet-500 transition"
          />
          <button
            type="button"
            onClick={sendMessage}
            disabled={!input.trim() || typing}
            className="shrink-0 p-2 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed transition text-white"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function Step10({ data, router }: { data: FormData; router: ReturnType<typeof useRouter> }) {
  const scheduleLabel = data.schedule.allDay
    ? "24/7 — sem restrição"
    : "Seg–Sex das 08:00 às 18:00";

  return (
    <div className="space-y-6">
      {/* Summary card */}
      <div className="p-5 rounded-2xl border border-white/10 bg-white/5 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center shrink-0">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-lg font-bold text-white">
              {data.agentName || "Sofia"}
            </p>
            <p className="text-sm text-slate-400">Agente IA · Zaia</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Empresa", value: data.companyName || "—" },
            { label: "Nicho", value: data.niche || "—" },
            { label: "Tom de voz", value: data.tone || "—" },
            { label: "Horários", value: scheduleLabel },
            { label: "Objetivos", value: `${data.objectives.length} configurado${data.objectives.length !== 1 ? "s" : ""}` },
            { label: "Produtos", value: `${data.products.length} cadastrado${data.products.length !== 1 ? "s" : ""}` },
          ].map(({ label, value }) => (
            <div key={label} className="p-3 rounded-xl bg-white/5 border border-white/8">
              <p className="text-xs text-slate-500">{label}</p>
              <p className="text-sm font-medium text-slate-200 mt-0.5">{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Ready banner */}
      <div className="flex items-center gap-3 p-4 rounded-xl border border-green-500/25 bg-green-500/8">
        <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
          <Check className="w-4 h-4 text-green-400" />
        </div>
        <div>
          <p className="text-sm font-semibold text-green-400">
            Agente pronto para publicar!
          </p>
          <p className="text-xs text-slate-400 mt-0.5">
            Conecte seu WhatsApp para ativar o agente agora mesmo.
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <button
          type="button"
          onClick={() => router.push("/dashboard/whatsapp")}
          className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl font-bold text-white text-base transition-all
            bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-500 hover:to-emerald-400
            shadow-[0_0_24px_rgba(34,197,94,0.35)] hover:shadow-[0_0_36px_rgba(34,197,94,0.5)]"
        >
          <Rocket className="w-5 h-5" />
          Conectar WhatsApp e Publicar
        </button>
        <button
          type="button"
          onClick={() => router.push("/dashboard")}
          className="w-full py-3 rounded-2xl text-sm font-medium text-slate-400 hover:text-white border border-white/10 hover:border-white/20 transition"
        >
          Fazer depois
        </button>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

const defaultSchedule: Schedule = {
  seg: { enabled: true, start: "08:00", end: "18:00" },
  ter: { enabled: true, start: "08:00", end: "18:00" },
  qua: { enabled: true, start: "08:00", end: "18:00" },
  qui: { enabled: true, start: "08:00", end: "18:00" },
  sex: { enabled: true, start: "08:00", end: "18:00" },
  sab: { enabled: false, start: "08:00", end: "13:00" },
  dom: { enabled: false, start: "08:00", end: "13:00" },
  allDay: false,
};

const initialData: FormData = {
  companyName: "",
  segment: "",
  phone: "",
  website: "",
  niche: "",
  objectives: [],
  schedule: defaultSchedule,
  products: [],
  faqs: DEFAULT_FAQS,
  agentName: "",
  tone: "Amigável",
  greeting: "",
  fakeFiles: [],
  additionalInfo: "",
};

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialData);

  const updateData = (patch: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...patch }));
  };

  const progress = Math.round((currentStep / 10) * 100);

  const StepIcon = STEPS[currentStep - 1].icon;

  const canGoNext = () => {
    if (currentStep === 1)
      return formData.companyName.trim() && formData.segment && formData.phone.trim();
    if (currentStep === 2) return !!formData.niche;
    if (currentStep === 3) return formData.objectives.length > 0;
    return true;
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1 data={formData} setData={updateData} />;
      case 2:
        return <Step2 data={formData} setData={updateData} />;
      case 3:
        return <Step3 data={formData} setData={updateData} />;
      case 4:
        return <Step4 data={formData} setData={updateData} />;
      case 5:
        return <Step5 data={formData} setData={updateData} />;
      case 6:
        return <Step6 data={formData} setData={updateData} />;
      case 7:
        return <Step7 data={formData} setData={updateData} />;
      case 8:
        return <Step8 data={formData} setData={updateData} />;
      case 9:
        return <Step9 data={formData} />;
      case 10:
        return <Step10 data={formData} router={router} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col">
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-violet-600/8 rounded-full blur-[120px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between gap-3 px-4 sm:px-6 py-4 sm:py-5 border-b border-white/6">
        {/* Zaia logo */}
        <Logo size={32} />

        {/* Step counter */}
        <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-slate-400 shrink-0">
          <StepIcon className="w-4 h-4 text-violet-400" />
          {/* Compact label on mobile */}
          <span className="sm:hidden">
            <span className="font-semibold text-white">{currentStep}</span>/10
          </span>
          <span className="hidden sm:inline">
            Passo{" "}
            <span className="font-semibold text-white">{currentStep}</span> de{" "}
            <span className="font-semibold text-white">10</span>
          </span>
        </div>
      </header>

      {/* Progress bar */}
      <div className="relative z-10 h-1 bg-white/5">
        <div
          className="h-full bg-gradient-to-r from-violet-600 to-blue-500 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center px-4 py-8">
        <div className="w-full max-w-2xl">
          {/* Step header */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-1">
              <div className="text-xs font-medium text-violet-400 uppercase tracking-widest">
                {progress}% concluído
              </div>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              {STEPS[currentStep - 1].label}
            </h1>
            <div className="mt-2 flex gap-1">
              {STEPS.map((_, i) => (
                <div
                  key={i}
                  className={`h-0.5 flex-1 rounded-full transition-all duration-300 ${
                    i < currentStep ? "bg-violet-500" : "bg-white/10"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Card */}
          <div className="rounded-2xl border border-white/10 bg-[#111118] p-5 sm:p-8 shadow-2xl">
            {renderStep()}
          </div>

          {/* Navigation */}
          {currentStep < 10 && (
            <div className="flex items-center justify-between gap-3 mt-5">
              <button
                type="button"
                onClick={() => setCurrentStep((s) => Math.max(1, s - 1))}
                disabled={currentStep === 1}
                className="px-4 sm:px-5 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white border border-white/10 hover:border-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition"
              >
                ← Voltar
              </button>

              <button
                type="button"
                onClick={() => setCurrentStep((s) => Math.min(10, s + 1))}
                disabled={!canGoNext()}
                className="px-5 sm:px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all
                  bg-gradient-to-r from-violet-600 to-blue-600
                  hover:from-violet-500 hover:to-blue-500
                  disabled:opacity-40 disabled:cursor-not-allowed
                  shadow-[0_0_16px_rgba(139,92,246,0.3)] hover:shadow-[0_0_24px_rgba(139,92,246,0.5)]"
              >
                Próximo →
              </button>
            </div>
          )}

          {currentStep === 10 && (
            <div className="flex justify-start mt-5">
              <button
                type="button"
                onClick={() => setCurrentStep((s) => Math.max(1, s - 1))}
                className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white border border-white/10 hover:border-white/20 transition"
              >
                ← Voltar
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
