"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSignIn } from "@clerk/nextjs";

import { Eye, EyeOff, Mail, Lock } from "lucide-react";
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

export default function LoginPage() {
  const router = useRouter();
  const { signIn, fetchStatus } = useSignIn();
  const isReady = fetchStatus === "idle";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!signIn) return;
    setLoading(true);
    setError("");

    const { error: pwErr } = await signIn.password({ identifier: email, password });
    if (pwErr) {
      setError(clerkMsg(pwErr));
      setLoading(false);
      return;
    }

    const { error: finalErr } = await signIn.finalize({
      navigate: ({ decorateUrl }) => router.push(decorateUrl("/dashboard")),
    });
    if (finalErr) setError(clerkMsg(finalErr));
    setLoading(false);
  }

  async function handleGoogle() {
    if (!signIn) return;
    await signIn.sso({
      strategy: "oauth_google",
      redirectUrl: `${window.location.origin}/sso-callback`,
      redirectCallbackUrl: `${window.location.origin}/sso-callback`,
    });
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="glass rounded-2xl p-8 shadow-2xl shadow-black/40">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <BrandMark size={48} />
          <span className="text-xl font-bold tracking-tight text-white">Zaia</span>
        </div>

        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Bem-vindo de volta</h1>
          <p className="text-sm text-slate-400">Entre na sua conta para continuar</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label htmlFor="email" className="block text-sm font-medium text-slate-300">
              E-mail
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-500 pointer-events-none" />
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl bg-white/5 border border-white/10 pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-slate-500 hover:border-white/20 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all duration-200"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="password" className="block text-sm font-medium text-slate-300">
              Senha
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-500 pointer-events-none" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                placeholder="Sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl bg-white/5 border border-white/10 pl-10 pr-11 py-2.5 text-sm text-white placeholder:text-slate-500 hover:border-white/20 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all duration-200"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <Link href="/forgot-password" className="text-xs text-violet-400 hover:text-violet-300 transition-colors">
              Esqueci a senha
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading || !isReady}
            className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-2.5 text-sm shadow-lg shadow-violet-500/25 transition-all duration-200 active:scale-[0.98]"
          >
            {loading ? <span className="flex items-center justify-center gap-2"><Spinner /> Entrando…</span> : "Entrar"}
          </button>

          <div className="relative flex items-center gap-3">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-slate-500 shrink-0">ou</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <button
            type="button"
            onClick={handleGoogle}
            disabled={!isReady}
            className="w-full flex items-center justify-center gap-3 rounded-xl glass border border-white/10 hover:border-white/20 text-white font-medium py-2.5 text-sm transition-all duration-200 active:scale-[0.98] hover:bg-white/5 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <GoogleIcon className="size-4" />
            Continuar com Google
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Não tem conta?{" "}
          <Link href="/signup" className="font-medium text-violet-400 hover:text-violet-300 transition-colors">
            Criar conta grátis
          </Link>
        </p>
      </div>
    </div>
  );
}
