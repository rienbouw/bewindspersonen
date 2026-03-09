"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#031525] text-slate-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(6,182,212,0.33),transparent_42%),radial-gradient(circle_at_80%_18%,rgba(14,165,233,0.28),transparent_38%),radial-gradient(circle_at_50%_88%,rgba(20,184,166,0.2),transparent_45%)]" />
      <div className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full bg-cyan-300/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-20 h-80 w-80 rounded-full bg-teal-300/20 blur-3xl" />

      <main className="relative mx-auto flex min-h-screen w-full max-w-6xl items-center px-6 py-14 md:px-10">
        <div className="grid w-full gap-7 md:grid-cols-[1.15fr_1fr]">
          <section className="rounded-3xl border border-white/15 bg-white/5 p-8 backdrop-blur-xl md:p-10">
            <p className="mb-4 inline-flex rounded-full border border-cyan-100/40 bg-cyan-300/15 px-4 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-50">
              Kabinet Jetten 1
            </p>
            <h1 className="max-w-xl text-4xl font-black leading-tight tracking-tight text-white md:text-6xl">
              Kies je spel
            </h1>
            <p className="mt-5 max-w-xl text-base text-slate-100/80 md:text-lg">
              Speel de snelle naamquiz of ga all-in met de fruitmachine.
            </p>
          </section>

          <section className="grid gap-4">
            <Link
              href="/quiz"
              className="group rounded-3xl border border-cyan-100/45 bg-gradient-to-br from-cyan-300/20 via-sky-400/20 to-cyan-50/10 p-6 shadow-[0_20px_70px_rgba(6,182,212,0.28)] transition-all duration-300 hover:-translate-y-1 hover:border-cyan-100/70 hover:shadow-[0_26px_85px_rgba(6,182,212,0.42)]"
            >
              <h2 className="mt-2 text-2xl font-extrabold text-white">Namen intypen</h2>
              <p className="mt-2 text-sm text-slate-100/80">Zie de foto, typ de naam, bouw je score op.</p>
            </Link>

            <Link
              href="/slot"
              className="group rounded-3xl border border-teal-100/45 bg-gradient-to-br from-teal-300/20 via-emerald-400/20 to-cyan-50/10 p-6 shadow-[0_20px_70px_rgba(16,185,129,0.25)] transition-all duration-300 hover:-translate-y-1 hover:border-teal-100/70 hover:shadow-[0_26px_85px_rgba(16,185,129,0.4)]"
            >
              <h2 className="mt-2 text-2xl font-extrabold text-white">Fruitmachine</h2>
              <p className="mt-2 text-sm text-slate-100/80">Match functie, foto en naam op de payline.</p>
            </Link>
          </section>
        </div>
      </main>
    </div>
  );
}
