"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import { BrandMark } from "@/components/brand/logo";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);
    setSubmitted(true);
  }

  return (
    <div className="mx-auto w-full max-w-md">
      {/* Card */}
      <div className="glass rounded-2xl p-8 shadow-2xl shadow-black/40">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <BrandMark size={48} />
          <span className="text-xl font-bold tracking-tight text-white">Zaia</span>
        </div>

        {submitted ? (
          /* ── Success state ── */
          <div className="flex flex-col items-center text-center gap-5">
            <div className="grid size-16 place-items-center rounded-full bg-emerald-500/10 border border-emerald-500/30">
              <CheckCircle2 className="size-8 text-emerald-400" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold text-white">E-mail enviado!</h2>
              <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
                Enviamos um link de recuperação para{" "}
                <span className="font-medium text-slate-200">{email}</span>.
                Verifique sua caixa de entrada e spam.
              </p>
            </div>

            <Link
              href="/login"
              className="flex items-center gap-2 text-sm font-medium text-violet-400 hover:text-violet-300 transition-colors"
            >
              <ArrowLeft className="size-4" />
              Voltar para o login
            </Link>
          </div>
        ) : (
          /* ── Form state ── */
          <>
            <div className="mb-7 text-center">
              <h1 className="text-2xl font-bold text-white mb-2">
                Recuperar senha
              </h1>
              <p className="text-sm text-slate-400 leading-relaxed">
                Informe seu e-mail e enviaremos um link para você criar uma nova senha.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
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

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-2.5 text-sm shadow-lg shadow-violet-500/25 transition-all duration-200 active:scale-[0.98]"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin size-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Enviando…
                  </span>
                ) : (
                  "Enviar link de recuperação"
                )}
              </button>
            </form>

            {/* Back to login */}
            <div className="mt-6 text-center">
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-300 transition-colors"
              >
                <ArrowLeft className="size-3.5" />
                Voltar para o login
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
