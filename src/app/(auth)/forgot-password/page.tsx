"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSignIn } from "@clerk/nextjs";

import { Mail, ArrowLeft, CheckCircle2, Lock, Eye, EyeOff } from "lucide-react";
import { BrandMark } from "@/components/brand/logo";

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

type Step = "email" | "code" | "done";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { signIn, fetchStatus } = useSignIn();
  const isReady = fetchStatus === "idle";

  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleRequestCode(e: React.FormEvent) {
    e.preventDefault();
    if (!signIn) return;
    setLoading(true);
    setError("");

    // Identify the user first, then send the reset code
    const { error: createErr } = await signIn.create({ identifier: email });
    if (createErr) {
      setError(clerkMsg(createErr));
      setLoading(false);
      return;
    }

    const { error: sendErr } = await signIn.resetPasswordEmailCode.sendCode();
    if (sendErr) {
      setError(clerkMsg(sendErr));
      setLoading(false);
      return;
    }

    setStep("code");
    setLoading(false);
  }

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    if (!signIn) return;
    setLoading(true);
    setError("");

    const { error: verifyErr } = await signIn.resetPasswordEmailCode.verifyCode({ code });
    if (verifyErr) {
      setError(clerkMsg(verifyErr));
      setLoading(false);
      return;
    }

    const { error: submitErr } = await signIn.resetPasswordEmailCode.submitPassword({
      password: newPassword,
      signOutOfOtherSessions: true,
    });
    if (submitErr) {
      setError(clerkMsg(submitErr));
      setLoading(false);
      return;
    }

    const { error: finalErr } = await signIn.finalize({
      navigate: ({ decorateUrl }) => router.push(decorateUrl("/dashboard")),
    });
    if (finalErr) setError(clerkMsg(finalErr));
    setLoading(false);
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="glass rounded-2xl p-8 shadow-2xl shadow-black/40">
        <div className="mb-8 flex flex-col items-center gap-3">
          <BrandMark size={48} />
          <span className="text-xl font-bold tracking-tight text-white">Zaia</span>
        </div>

        {step === "email" && (
          <>
            <div className="mb-7 text-center">
              <h1 className="text-2xl font-bold text-white mb-2">Recuperar senha</h1>
              <p className="text-sm text-slate-400 leading-relaxed">
                Informe seu e-mail e enviaremos um código de recuperação.
              </p>
            </div>

            <form onSubmit={handleRequestCode} className="space-y-5">
              {error && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</div>
              )}

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

              <button
                type="submit" disabled={loading || !isReady}
                className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-2.5 text-sm shadow-lg shadow-violet-500/25 transition-all duration-200 active:scale-[0.98]"
              >
                {loading ? <span className="flex items-center justify-center gap-2"><Spinner /> Enviando…</span> : "Enviar código"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <Link href="/login" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-300 transition-colors">
                <ArrowLeft className="size-3.5" />
                Voltar para o login
              </Link>
            </div>
          </>
        )}

        {step === "code" && (
          <>
            <div className="mb-7 text-center space-y-2">
              <h1 className="text-2xl font-bold text-white">Nova senha</h1>
              <p className="text-sm text-slate-400 leading-relaxed">
                Digite o código enviado para{" "}
                <span className="text-white font-medium">{email}</span> e escolha uma nova senha.
              </p>
            </div>

            <form onSubmit={handleReset} className="space-y-5">
              {error && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</div>
              )}

              <div className="space-y-1.5">
                <label htmlFor="code" className="block text-sm font-medium text-slate-300">Código de verificação</label>
                <input
                  id="code" type="text" inputMode="numeric" autoComplete="one-time-code"
                  required maxLength={6} placeholder="000000"
                  value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                  className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-center text-lg font-mono tracking-[0.5em] text-white placeholder:text-slate-600 hover:border-white/20 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all duration-200"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="new-password" className="block text-sm font-medium text-slate-300">Nova senha</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-500 pointer-events-none" />
                  <input
                    id="new-password" type={showPassword ? "text" : "password"}
                    autoComplete="new-password" required minLength={8} placeholder="Mínimo 8 caracteres"
                    value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full rounded-xl bg-white/5 border border-white/10 pl-10 pr-11 py-2.5 text-sm text-white placeholder:text-slate-500 hover:border-white/20 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all duration-200"
                  />
                  <button type="button" onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit" disabled={loading || code.length < 6 || newPassword.length < 8}
                className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-2.5 text-sm shadow-lg shadow-violet-500/25 transition-all duration-200 active:scale-[0.98]"
              >
                {loading ? <span className="flex items-center justify-center gap-2"><Spinner /> Redefinindo…</span> : "Redefinir senha"}
              </button>
            </form>
          </>
        )}

        {step === "done" && (
          <div className="flex flex-col items-center text-center gap-5">
            <div className="grid size-16 place-items-center rounded-full bg-emerald-500/10 border border-emerald-500/30">
              <CheckCircle2 className="size-8 text-emerald-400" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-white">Senha redefinida!</h2>
              <p className="text-sm text-slate-400">Sua senha foi atualizada com sucesso.</p>
            </div>
            <Link href="/login" className="flex items-center gap-2 text-sm font-medium text-violet-400 hover:text-violet-300 transition-colors">
              <ArrowLeft className="size-4" />
              Ir para o login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
