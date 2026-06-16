import Link from "next/link";
import {
  ArrowRight,
  Bot,
  BarChart3,
  CalendarClock,
  Check,
  CircleDollarSign,
  Headphones,
  MessageCircle,
  Repeat,
  Sparkles,
  Star,
  Users,
  Zap,
} from "lucide-react";
import { Logo } from "@/components/brand/logo";

/* ── Navbar ──────────────────────────────────────────────────── */
function Navbar() {
  const links = [
    { label: "Produto", href: "#features" },
    { label: "Como funciona", href: "#how" },
    { label: "Agentes", href: "#agents" },
    { label: "Preços", href: "#pricing" },
  ];
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-[#0a0a0f]/70 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
        <Logo />
        <div className="hidden items-center gap-6 md:flex lg:gap-8">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-slate-400 transition hover:text-white"
            >
              {l.label}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/login"
            className="hidden text-sm font-medium text-slate-300 transition hover:text-white sm:block"
          >
            Entrar
          </Link>
          <Link
            href="/signup"
            className="inline-flex h-9 items-center gap-1.5 whitespace-nowrap rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-3 text-sm font-medium text-white shadow-lg shadow-violet-500/25 transition hover:from-violet-500 hover:to-blue-500 sm:px-4"
          >
            Começar grátis
          </Link>
        </div>
      </nav>
    </header>
  );
}

/* ── Hero ────────────────────────────────────────────────────── */
function Hero() {
  return (
    <section className="relative overflow-hidden px-4 pt-28 pb-16 sm:px-6 sm:pt-32 sm:pb-24 lg:pt-36">
      <div className="bg-radial-glow-purple pointer-events-none absolute inset-0" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <div className="mb-6 inline-flex max-w-full items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-300">
            <Sparkles className="size-3.5 shrink-0" />
            Powered by IA generativa de última geração
          </div>
          <h1 className="text-balance text-3xl font-bold leading-[1.1] tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
            Transforme seu WhatsApp em uma{" "}
            <span className="gradient-text">máquina de vendas com IA</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-400 sm:text-lg">
            A Zaia cria agentes de IA que vendem, atendem, agendam e cobram pelo
            WhatsApp — 24 horas por dia, sem contratar ninguém. Configure em
            minutos, sem precisar de código.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/signup"
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-6 font-medium text-white shadow-lg shadow-violet-500/25 transition hover:from-violet-500 hover:to-blue-500 sm:w-auto"
            >
              Criar meu agente grátis
              <ArrowRight className="size-4" />
            </Link>
            <a
              href="#how"
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 font-medium text-white transition hover:bg-white/10 sm:w-auto"
            >
              Ver como funciona
            </a>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-500">
            {["Sem cartão de crédito", "Setup em 5 minutos", "+1.000 empresas"].map(
              (t) => (
                <span key={t} className="flex items-center gap-1.5">
                  <Check className="size-4 text-emerald-400" />
                  {t}
                </span>
              )
            )}
          </div>
        </div>

        {/* Chat mockup */}
        <div className="relative mx-auto w-full max-w-sm animate-float">
          <div className="glow-purple pointer-events-none absolute -inset-4 rounded-3xl opacity-40 blur-2xl" />
          <div className="glass relative mx-auto w-full max-w-sm rounded-[2rem] border border-white/10 p-3 shadow-2xl">
            <div className="rounded-[1.5rem] bg-[#0b141a] p-4">
              <div className="mb-4 flex items-center gap-3 border-b border-white/5 pb-3">
                <div className="grid size-10 place-items-center rounded-full bg-gradient-to-br from-violet-500 to-blue-600 text-sm font-bold text-white">
                  Z
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Agente Zaia · Vendas</p>
                  <p className="flex items-center gap-1 text-xs text-emerald-400">
                    <span className="size-1.5 rounded-full bg-emerald-400" />
                    online
                  </p>
                </div>
              </div>
              <div className="space-y-3 text-sm">
                <div className="ml-auto max-w-[80%] rounded-2xl rounded-tr-sm bg-[#005c4b] px-3 py-2 text-white">
                  Oi! Vocês fazem entrega hoje?
                </div>
                <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-[#1f2c34] px-3 py-2 text-slate-100">
                  Olá! 😊 Sim, entregamos hoje até as 18h. Me diz seu CEP que já
                  verifico o prazo e o frete pra você!
                </div>
                <div className="ml-auto max-w-[80%] rounded-2xl rounded-tr-sm bg-[#005c4b] px-3 py-2 text-white">
                  01310-100
                </div>
                <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-[#1f2c34] px-3 py-2 text-slate-100">
                  Perfeito! Entrega em até 2h, frete grátis acima de R$150. Quer
                  que eu já monte seu pedido? 🛒
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Social proof ────────────────────────────────────────────── */
function SocialProof() {
  const companies = ["TechShop", "Clínica Vida", "Imóveis Prime", "EduCursos", "FitGym", "Moda Bella"];
  return (
    <section className="border-y border-white/5 px-4 py-10 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-7xl">
        <p className="text-center text-xs font-medium uppercase tracking-widest text-slate-600">
          Empresas que escalam o atendimento com a Zaia
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 sm:gap-x-12 sm:gap-y-6">
          {companies.map((c) => (
            <span key={c} className="text-base font-semibold text-slate-600 transition hover:text-slate-400 sm:text-lg">
              {c}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Features ────────────────────────────────────────────────── */
function Features() {
  const features = [
    { icon: Bot, title: "Agente SDR inteligente", desc: "Qualifica leads, responde objeções e agenda reuniões automaticamente, como um vendedor sênior." },
    { icon: Headphones, title: "Suporte 24/7", desc: "Resolve dúvidas, abre chamados e acompanha pedidos sem fila e sem horário comercial." },
    { icon: CalendarClock, title: "Agendamento automático", desc: "Integra com sua agenda, oferece horários e confirma compromissos sozinho." },
    { icon: Sparkles, title: "Base de conhecimento (RAG)", desc: "Treine com PDFs, sites e FAQs. O agente responde com a informação real da sua empresa." },
    { icon: BarChart3, title: "Analytics em tempo real", desc: "Acompanhe conversões, leads, horários de pico e desempenho de cada agente." },
    { icon: Users, title: "Transferência humana", desc: "Quando precisar, o agente passa a conversa para um atendente sem perder o contexto." },
  ];
  return (
    <section id="features" className="px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
            Tudo que seu atendimento precisa, <span className="gradient-text">automatizado</span>
          </h2>
          <p className="mt-4 text-slate-400">
            Uma plataforma completa para transformar processos manuais em automações inteligentes.
          </p>
        </div>
        <div className="mt-12 grid gap-5 sm:mt-16 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="glass group rounded-2xl p-6 transition hover:bg-white/[0.07]"
            >
              <div className="mb-4 grid size-11 place-items-center rounded-xl bg-gradient-to-br from-violet-500/20 to-blue-500/20 text-violet-300 ring-1 ring-violet-500/20">
                <f.icon className="size-5" />
              </div>
              <h3 className="font-semibold text-white">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── How it works ────────────────────────────────────────────── */
function HowItWorks() {
  const steps = [
    { n: "01", title: "Configure seu agente", desc: "Responda um assistente passo a passo: nicho, objetivos, produtos e tom de voz. Em minutos seu agente está pronto." },
    { n: "02", title: "Conecte o WhatsApp", desc: "Vincule seu WhatsApp Business com poucos cliques. Sem complicação técnica, sem aprovações demoradas." },
    { n: "03", title: "Escale automaticamente", desc: "Publique e deixe o agente atender, vender e agendar. Monitore tudo pelo painel em tempo real." },
  ];
  return (
    <section id="how" className="bg-dark-gradient px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
            Do zero ao agente publicado em <span className="gradient-text">3 passos</span>
          </h2>
          <p className="mt-4 text-slate-400">Sem código. Sem equipe técnica. Sem dor de cabeça.</p>
        </div>
        <div className="mt-12 grid gap-6 sm:mt-16 md:grid-cols-3">
          {steps.map((s) => (
            <div key={s.n} className="glass relative rounded-2xl p-6 sm:p-8">
              <span className="gradient-text text-5xl font-bold">{s.n}</span>
              <h3 className="mt-4 text-lg font-semibold text-white">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Agent templates ─────────────────────────────────────────── */
function AgentTemplates() {
  const agents = [
    { icon: CircleDollarSign, name: "Agente SDR / Vendas", desc: "Qualifica e converte leads em clientes.", color: "from-violet-500 to-purple-600" },
    { icon: Headphones, name: "Agente de Suporte", desc: "Atende e resolve dúvidas 24/7.", color: "from-blue-500 to-cyan-600" },
    { icon: Repeat, name: "Agente de Cobrança", desc: "Recupera pagamentos com gentileza.", color: "from-emerald-500 to-green-600" },
    { icon: CalendarClock, name: "Agente de Agendamento", desc: "Marca e confirma compromissos.", color: "from-amber-500 to-orange-600" },
  ];
  return (
    <section id="agents" className="px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
            Comece com um <span className="gradient-text">agente pronto</span>
          </h2>
          <p className="mt-4 text-slate-400">
            Templates treinados para cada objetivo. Personalize e publique em minutos.
          </p>
        </div>
        <div className="mt-12 grid gap-5 sm:mt-16 sm:grid-cols-2 lg:grid-cols-4">
          {agents.map((a) => (
            <div key={a.name} className="glass group flex flex-col rounded-2xl p-6 transition hover:bg-white/[0.07]">
              <div className={`mb-4 grid size-12 place-items-center rounded-xl bg-gradient-to-br ${a.color} text-white shadow-lg`}>
                <a.icon className="size-6" />
              </div>
              <h3 className="font-semibold text-white">{a.name}</h3>
              <p className="mt-2 flex-1 text-sm text-slate-400">{a.desc}</p>
              <Link
                href="/signup"
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-violet-300 transition group-hover:gap-2.5"
              >
                Usar template <ArrowRight className="size-4" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Pricing ─────────────────────────────────────────────────── */
function Pricing() {
  const plans = [
    {
      name: "Starter",
      price: "197",
      desc: "Para começar a automatizar.",
      features: ["1 agente de IA", "1.000 conversas/mês", "Base de conhecimento", "Analytics essencial", "Suporte por e-mail"],
      cta: "Começar agora",
      popular: false,
    },
    {
      name: "Professional",
      price: "497",
      desc: "Para empresas em crescimento.",
      features: ["5 agentes de IA", "10.000 conversas/mês", "Templates de agentes", "Transferência humana", "Analytics avançado", "Integrações + API"],
      cta: "Escolher Professional",
      popular: true,
    },
    {
      name: "Enterprise",
      price: "997",
      desc: "Para operações em escala.",
      features: ["Agentes ilimitados", "Conversas ilimitadas", "SLA dedicado", "Onboarding assistido", "Gerente de conta", "Segurança avançada"],
      cta: "Falar com vendas",
      popular: false,
    },
  ];
  return (
    <section id="pricing" className="px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
            Planos que <span className="gradient-text">cabem no seu negócio</span>
          </h2>
          <p className="mt-4 text-slate-400">
            Sem fidelidade. Cancele quando quiser. 7 dias de teste grátis em todos os planos.
          </p>
        </div>
        <div className="mt-12 grid items-start gap-6 sm:mt-16 lg:grid-cols-3">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`relative rounded-2xl p-6 sm:p-8 ${
                p.popular
                  ? "border-gradient bg-card shadow-2xl shadow-violet-500/10 lg:-mt-4 lg:pb-12"
                  : "glass"
              }`}
            >
              {p.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-violet-600 to-blue-600 px-3 py-1 text-xs font-semibold text-white shadow-lg">
                  MAIS POPULAR
                </span>
              )}
              <h3 className="text-lg font-semibold text-white">{p.name}</h3>
              <p className="mt-1 text-sm text-slate-400">{p.desc}</p>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-sm text-slate-400">R$</span>
                <span className="text-4xl font-bold text-white">{p.price}</span>
                <span className="text-sm text-slate-400">/mês</span>
              </div>
              <Link
                href="/signup"
                className={`mt-6 inline-flex h-11 w-full items-center justify-center rounded-xl font-medium transition ${
                  p.popular
                    ? "bg-gradient-to-r from-violet-600 to-blue-600 text-white shadow-lg shadow-violet-500/25 hover:from-violet-500 hover:to-blue-500"
                    : "border border-white/10 bg-white/5 text-white hover:bg-white/10"
                }`}
              >
                {p.cta}
              </Link>
              <ul className="mt-8 space-y-3">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-slate-300">
                    <Check className="size-4 shrink-0 text-emerald-400" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Testimonials ────────────────────────────────────────────── */
function Testimonials() {
  const items = [
    { name: "Marina Souza", company: "TechShop", initials: "MS", quote: "Triplicamos as vendas pelo WhatsApp sem contratar ninguém. O agente da Zaia responde melhor que muito vendedor." },
    { name: "Rafael Lima", company: "Clínica Vida", initials: "RL", quote: "Os agendamentos passaram a ser automáticos. Reduzimos faltas em 40% com as confirmações da IA." },
    { name: "Camila Torres", company: "Imóveis Prime", initials: "CT", quote: "O agente qualifica os leads antes de chegarem ao corretor. Nosso time só fala com quem realmente quer comprar." },
  ];
  return (
    <section className="bg-dark-gradient px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
            Resultados reais de quem usa a <span className="gradient-text">Zaia</span>
          </h2>
        </div>
        <div className="mt-12 grid gap-6 sm:mt-16 md:grid-cols-3">
          {items.map((t) => (
            <div key={t.name} className="glass rounded-2xl p-6">
              <div className="flex gap-0.5 text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-4 fill-current" />
                ))}
              </div>
              <p className="mt-4 text-sm leading-relaxed text-slate-300">“{t.quote}”</p>
              <div className="mt-6 flex items-center gap-3">
                <div className="grid size-10 place-items-center rounded-full bg-gradient-to-br from-violet-500 to-blue-600 text-sm font-semibold text-white">
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{t.name}</p>
                  <p className="text-xs text-slate-400">{t.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── CTA banner ──────────────────────────────────────────────── */
function CTABanner() {
  return (
    <section className="px-4 py-16 sm:px-6 sm:py-24">
      <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 to-blue-700 px-6 py-12 text-center shadow-2xl shadow-violet-500/20 sm:px-8 sm:py-16">
        <div className="pointer-events-none absolute inset-0 opacity-20 [background:radial-gradient(circle_at_30%_20%,white,transparent_50%)]" />
        <h2 className="relative text-balance text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
          Pronto para colocar a IA para trabalhar no seu WhatsApp?
        </h2>
        <p className="relative mx-auto mt-4 max-w-xl text-violet-100">
          Crie seu primeiro agente grátis hoje. Sem cartão de crédito, sem código, sem complicação.
        </p>
        <Link
          href="/signup"
          className="relative mt-8 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-white px-7 font-semibold text-violet-700 shadow-lg transition hover:bg-violet-50 sm:w-auto"
        >
          <Zap className="size-4" />
          Começar grátis agora
        </Link>
      </div>
    </section>
  );
}

/* ── Footer ──────────────────────────────────────────────────── */
function Footer() {
  const cols = [
    { title: "Produto", links: ["Funcionalidades", "Preços", "Templates", "Integrações"] },
    { title: "Empresa", links: ["Sobre", "Blog", "Cases", "Carreiras"] },
    { title: "Recursos", links: ["Documentação", "Central de ajuda", "API", "Status"] },
    { title: "Legal", links: ["Privacidade", "Termos", "LGPD", "Segurança"] },
  ];
  return (
    <footer className="border-t border-white/5 px-4 py-12 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-2 gap-8 sm:gap-10 lg:grid-cols-6">
          <div className="col-span-2 lg:col-span-2">
            <Logo />
            <p className="mt-4 max-w-xs text-sm text-slate-400">
              Seu time de IA no WhatsApp. Automatize vendas, suporte e agendamentos em escala.
            </p>
            <div className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300">
              <MessageCircle className="size-3.5" /> WhatsApp Business API oficial
            </div>
          </div>
          {cols.map((c) => (
            <div key={c.title}>
              <h4 className="text-sm font-semibold text-white">{c.title}</h4>
              <ul className="mt-4 space-y-2.5">
                {c.links.map((l) => (
                  <li key={l}>
                    <a href="#" className="text-sm text-slate-400 transition hover:text-white">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 text-sm text-slate-500 sm:flex-row">
          <p>© {new Date().getFullYear()} Zaia Tecnologia Ltda. Todos os direitos reservados.</p>
          <p>Feito no Brasil 🇧🇷</p>
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-[#0a0a0f]">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <SocialProof />
        <Features />
        <HowItWorks />
        <AgentTemplates />
        <Pricing />
        <Testimonials />
        <CTABanner />
      </main>
      <Footer />
    </div>
  );
}
