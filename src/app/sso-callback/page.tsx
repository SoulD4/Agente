"use client";

import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";

export default function SSOCallbackPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0f]">
      <div className="text-center">
        <div className="mx-auto mb-4 size-10 animate-spin rounded-full border-4 border-violet-500/30 border-t-violet-500" />
        <p className="text-sm text-slate-400">Autenticando…</p>
      </div>
      <AuthenticateWithRedirectCallback />
    </div>
  );
}
