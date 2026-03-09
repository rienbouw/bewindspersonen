"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#04111a] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_16%,rgba(132,255,92,0.55),transparent_38%),radial-gradient(circle_at_88%_12%,rgba(59,130,246,0.38),transparent_34%),radial-gradient(circle_at_24%_84%,rgba(250,204,21,0.34),transparent_38%),radial-gradient(circle_at_78%_82%,rgba(0,255,102,0.5),transparent_35%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:42px_42px]" />

      <div className="pointer-events-none absolute -left-16 top-20 h-72 w-72 rounded-full bg-lime-300/60 blur-3xl animate-pulse" />
      <div className="pointer-events-none absolute right-0 top-10 h-96 w-96 rounded-full bg-blue-400/30 blur-3xl animate-pulse" />
      <div className="pointer-events-none absolute bottom-0 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-green-400/60 blur-3xl animate-pulse" />

      <main className="relative mx-auto flex min-h-screen w-full max-w-7xl items-center px-6 py-14 md:px-10">
        <div className="grid w-full gap-8 lg:grid-cols-[1.15fr_1fr]">
          <section className="rounded-[2rem] border border-green-300/80 bg-gradient-to-b from-green-400/35 to-green-500/15 p-8 shadow-[0_30px_120px_rgba(0,0,0,0.45)] backdrop-blur-2xl md:p-11">
            <div className="mb-5 inline-flex items-center rounded-full border border-lime-300 bg-lime-300 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#06230f]">
              Kabinet Jetten 1
            </div>

            <h1 className="max-w-2xl bg-gradient-to-r from-lime-300 via-green-400 to-blue-200 bg-clip-text text-5xl font-black leading-[0.95] tracking-tight text-transparent md:text-7xl">
              Kies je mode
            </h1>

            <p className="mt-6 max-w-xl text-lg text-slate-100/90 md:text-xl">
              Van snelle herkenning tot pure arcade-chaos. Kleurrijk, snel en verslavend.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <div className="rounded-full border border-lime-300 bg-lime-300 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#06230f]">
                15 vragen
              </div>
              <div className="rounded-full border border-yellow-300 bg-yellow-300 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#2a2200]">
                2 spelmodi
              </div>
              <div className="rounded-full border border-blue-300 bg-blue-300 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#061d39]">
                mobiel klaar
              </div>
            </div>
          </section>

          <section className="grid gap-5">
            <Link
              href="/quiz"
              className="group relative overflow-hidden rounded-[1.6rem] border border-blue-200 bg-gradient-to-br from-blue-500/45 via-cyan-400/30 to-green-400/30 p-7 shadow-[0_24px_90px_rgba(59,130,246,0.45)] transition-all duration-300 hover:-translate-y-1.5 hover:scale-[1.01]"
            >
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-blue-300/40 blur-2xl" />
              <div className="relative">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-50/95">Mode 01</p>
                <h2 className="mt-3 text-3xl font-extrabold">Namen intypen</h2>
                <p className="mt-3 max-w-sm text-sm text-slate-100/95">
                  Bekijk foto + rol en typ razendsnel de juiste naam.
                </p>
                <span className="mt-6 inline-flex items-center rounded-full border border-lime-300 bg-lime-300 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#06230f]">
                  Start quiz
                </span>
              </div>
            </Link>

            <Link
              href="/slot"
              className="group relative overflow-hidden rounded-[1.6rem] border border-lime-300 bg-gradient-to-br from-lime-300/35 via-green-400/45 to-yellow-300/28 p-7 shadow-[0_24px_90px_rgba(34,197,94,0.48)] transition-all duration-300 hover:-translate-y-1.5 hover:scale-[1.01]"
            >
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-lime-300/45 blur-2xl" />
              <div className="relative">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-lime-100">Mode 02</p>
                <h2 className="mt-3 text-3xl font-extrabold">Fruitmachine</h2>
                <p className="mt-3 max-w-sm text-sm text-slate-100/95">
                  Match functie, foto en naam op de lijn voor jackpot-vibes.
                </p>
                <span className="mt-6 inline-flex items-center rounded-full border border-green-400 bg-green-400 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#03220d]">
                  Start machine
                </span>
              </div>
            </Link>
          </section>
        </div>
      </main>
    </div>
  );
}
