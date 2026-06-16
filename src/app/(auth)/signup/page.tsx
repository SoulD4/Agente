"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSignUp } from "@clerk/nextjs";

import { Eye, EyeOff, Mail, Lock, User, CheckCircle2, KeyRound } from "lucide-react";
import { BrandMark } from "@/components/brand/logo";

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

function Spinner() {
  return (
    <svg className="animate-spin size-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

type ClerkErr = { message?: string; longMessage?: string } | null;
function clerkMsg(err: ClerkErr): string {
  return err?.longMessage ?? err?.message ?? "Erro inesperado. Tente novamente.";
}

const PASSWORD_RULES = [
  { label: "Mínimo 8 caracteres", test: (v: string) => v.length >= 8 },
  { label: "Uma letra maiúscula", test: (v: string) => /[A-Z]/.test(v) },
  { label: "Um número", test: (v: string) => /[0-9]/.test(v) },
];

export default function SignupPage() {
  const router = useRouter();
  const { signUp, fetchStatus } = useSignUp();
  const isReady = fetchStatus === "idle";

  const [step, setStep] = useState<"form" | "verify">("form");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [code, setCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const rulesMet = PASSWORD_RULES.map((r) => r.test(password));
  const allRulesMet = rulesMet.every(Boolean);
  const confirmMatch = confirm.length > 0 && confirm === password;

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    if (!signUp || !allRulesMet || !confirmMatch) return;
    setLoading(true);
    setError("");

    const [firstName, ...rest] = name.trim().split(" ");
    const { error: pwErr } = await signUp.password({
      emailAddress: email,
      password,
      firstName,
      lastName: rest.join(" ") || undefined,
    });

    if (pwErr) {
      setError(clerkMsg(pwErr));
      setLoading(false);
      return;
    }

    const { error: sendErr } = await signUp.verifications.sendEmailCode();
    if (sendErr) {
      setError(clerkMsg(sendErr));
      setLoading(false);
      return;
    }

    setStep("verify");
    setLoading(false);
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    if (!signUp) return;
    setLoading(true);
    setError("");

    const { error: verifyErr } = await signUp.verifications.verifyEmailCode({ code });
    if (verifyErr) {
      setError(clerkMsg(verifyErr));
      setLoading(false);
      return;
    }

    const { error: finalErr } = await signUp.finalize({
      navigate: ({ decorateUrl }) => router.push(decorateUrl("/onboarding")),
    });
    if (finalErr) setError(clerkMsg(finalErr));
    setLoading(false);
  }

  async function handleGoogle() {
    if (!signUp) return;
    await signUp.sso({
      strategy: "oauth_google",
      redirectUrl: `${window.location.origin}/onboarding`,
      redirectCallbackUrl: `${window.location.origin}/sso-callback`,
    });
  }

  if (step === "verify") {
    return (
      <div className="mx-auto w-full max-w-md">
        <div className="glass rounded-2xl p-8 shadow-2xl shadow-black/40">
          <div className="mb-8 flex flex-col items-center gap-3">
            <BrandMark size={48} />
            <span className="text-xl font-bold tracking-tight text-white">Zaia</span>
          </div>

          <div className="mb-7 text-center space-y-2">
            <div className="mx-auto mb-4 grid size-14 place-items-center rounded-full bg-violet-500/10 border border-violet-500/30">
              <KeyRound className="size-6 text-violet-400" />
            </div>
            <h1 className="text-2xl font-bold text-white">Verifique seu e-mail</h1>
            <p className="text-sm text-slate-400 leading-relaxed">
              Enviamos um código de 6 dígitos para{" "}
              <span className="text-white font-medium">{email}</span>
            </p>
          </div>

          <form onSubmit={handleVerify} className="space-y-5">
            {error && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label htmlFor="code" className="block text-sm font-medium text-slate-300">
                Código de verificação
              </label>
              <input
                id="code"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                required
                maxLength={6}
                placeholder="000000"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-center text-lg font-mono tracking-[0.5em] text-white placeholder:text-slate-600 hover:border-white/20 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all duration-200"
              />
            </div>

            <button
              type="submit"
              disabled={loading || code.length !== 6}
              className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-2.5 text-sm shadow-lg shadow-violet-500/25 transition-all duration-200 active:scale-[0.98]"
            >
              {loading ? <span className="flex items-center justify-center gap-2"><Spinner /> Verificando…</span> : "Verificar e continuar"}
            </button>
          </form>

          <p className="mt-4 text-center text-xs text-slate-500">
            Não recebeu o e-mail?{" "}
            <button
              type="button"
              className="text-violet-400 hover:text-violet-300 transition-colors"
              onClick={() => signUp?.verifications.sendEmailCode()}
            >
              Reenviar código
            </button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="glass rounded-2xl p-8 shadow-2xl shadow-black/40">
        <div className="mb-6 flex flex-col items-center gap-3">
          <BrandMark size={48} />
          <span className="text-xl font-bold tracking-tight text-white">Zaia</span>
        </div>

        <div className="mb-7 text-center space-y-3">
          <h1 className="text-2xl font-bold text-white">Criar sua conta grátis</h1>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-violet-600/20 to-blue-600/20 border border-violet-500/30 px-3.5 py-1 text-xs font-medium text-violet-300">
            <CheckCircle2 className="size-3.5" />
            7 dias grátis, sem cartão
          </span>
        </div>

        <form onSubmit={handleSignUp} className="space-y-4">
          {error && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label htmlFor="name" className="block text-sm font-medium text-slate-300">Nome completo</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-500 pointer-events-none" />
              <input
                id="name" type="text" autoComplete="name" required placeholder="Seu nome"
                value={name} onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl bg-white/5 border border-white/10 pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-slate-500 hover:border-white/20 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all duration-200"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="email" className="block text-sm font-medium text-slate-300">E-mail</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-500 pointer-events-none" />
              <input
                id="email" type="email" autoComplete="email" required placeholder="seu@email.com"
                value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl bg-white/5 border border-white/10 pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-slate-500 hover:border-white/20 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all duration-200"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="password" className="block text-sm font-medium text-slate-300">Senha</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-500 pointer-events-none" />
              <input
                id="password" type={showPassword ? "text" : "password"} autoComplete="new-password"
                required placeholder="Crie uma senha forte"
                value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl bg-white/5 border border-white/10 pl-10 pr-11 py-2.5 text-sm text-white placeholder:text-slate-500 hover:border-white/20 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all duration-200"
              />
              <button type="button" onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            {password.length > 0 && (
              <ul className="mt-2 space-y-1.5 pl-1">
                {PASSWORD_RULES.map((rule, i) => (
                  <li key={rule.label} className="flex items-center gap-2 text-xs">
                    <CheckCircle2 className={`size-3.5 shrink-0 transition-colors ${rulesMet[i] ? "text-emerald-400" : "text-slate-600"}`} />
                    <span className={rulesMet[i] ? "text-slate-300" : "text-slate-500"}>{rule.label}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="confirm" className="block text-sm font-medium text-slate-300">Confirmar senha</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-500 pointer-events-none" />
              <input
                id="confirm" type={showConfirm ? "text" : "password"} autoComplete="new-password"
                required placeholder="Repita a senha"
                value={confirm} onChange={(e) => setConfirm(e.target.value)}
                className={`w-full rounded-xl bg-white/5 border pl-10 pr-11 py-2.5 text-sm text-white placeholder:text-slate-500 hover:border-white/20 focus:outline-none focus:ring-2 transition-all duration-200 ${
                  confirm.length > 0 ? confirmMatch ? "border-emerald-500/50 focus:ring-emerald-500/30" : "border-red-500/50 focus:ring-red-500/30" : "border-white/10 focus:ring-violet-500/50"
                }`}
              />
              <button type="button" onClick={() => setShowConfirm((v) => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                {showConfirm ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            {confirm.length > 0 && !confirmMatch && <p className="text-xs text-red-400 pl-1">As senhas não coincidem</p>}
          </div>

          <button
            type="submit"
            disabled={loading || !isReady || !allRulesMet || !confirmMatch}
            className="w-full mt-1 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2.5 text-sm shadow-lg shadow-violet-500/25 transition-all duration-200 active:scale-[0.98]"
          >
            {loading ? <span className="flex items-center justify-center gap-2"><Spinner /> Criando conta…</span> : "Criar conta"}
          </button>

          <div className="relative flex items-center gap-3">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-slate-500 shrink-0">ou</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <button
            type="button" onClick={handleGoogle} disabled={!isReady}
            className="w-full flex items-center justify-center gap-3 rounded-xl glass border border-white/10 hover:border-white/20 text-white font-medium py-2.5 text-sm transition-all duration-200 active:scale-[0.98] hover:bg-white/5 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <GoogleIcon className="size-4" />
            Continuar com Google
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-slate-600 leading-relaxed">
          Ao criar uma conta, você concorda com nossos{" "}
          <Link href="/terms" className="text-slate-500 hover:text-slate-400 underline underline-offset-2">Termos</Link>{" "}
          e <Link href="/privacy" className="text-slate-500 hover:text-slate-400 underline underline-offset-2">Política de Privacidade</Link>.
        </p>

        <p className="mt-4 text-center text-sm text-slate-500">
          Já tem conta?{" "}
          <Link href="/login" className="font-medium text-violet-400 hover:text-violet-300 transition-colors">Entrar</Link>
        </p>
      </div>
    </div>
  );
}
