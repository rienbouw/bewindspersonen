"use client";

import Link from "next/link";
import { useState, useCallback, useEffect, useRef } from "react";
import { persons } from "../data";

function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function normalize(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[''`\-]/g, "")
    .toLowerCase()
    .trim();
}

function stripSpaces(s: string): string {
  return s.replace(/\s+/g, "");
}

function isCorrect(input: string, name: string): boolean {
  const normalizedInput = normalize(input);
  if (!normalizedInput) return false;

  const spacelessInput = stripSpaces(normalizedInput);
  const normalizedName = normalize(name);
  if (normalizedInput === normalizedName) return true;
  if (spacelessInput === stripSpaces(normalizedName)) return true;

  const parts = name.split(" ");
  const lastName = parts[parts.length - 1];
  const normalizedLast = normalize(lastName);
  if (normalizedInput === normalizedLast) return true;
  if (spacelessInput === stripSpaces(normalizedLast)) return true;

  const surnameParts = parts.slice(1);
  if (surnameParts.length > 0) {
    const normalizedSurname = normalize(surnameParts.join(" "));
    if (normalizedInput === normalizedSurname) return true;
    if (spacelessInput === stripSpaces(normalizedSurname)) return true;
  }

  return false;
}

const partyColors: Record<string, string> = {
  D66: "bg-emerald-500 text-white",
  VVD: "bg-orange-500 text-white",
  CDA: "bg-blue-600 text-white",
  Partijloos: "bg-purple-500 text-white",
};

const QUIZ_LENGTH = 15;

type QuizState = "answering" | "correct" | "incorrect";

export default function QuizPage() {
  const [order, setOrder] = useState<number[]>([]);
  const [current, setCurrent] = useState(0);
  const [input, setInput] = useState("");
  const [state, setState] = useState<QuizState>("answering");
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [imgError, setImgError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setOrder(shuffle(persons.map((_, i) => i)));

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js");
    }
  }, []);

  const person = order.length > 0 ? persons[order[current]] : null;
  const isFinished = answered === QUIZ_LENGTH && state === "answering";
  const progress = (answered / QUIZ_LENGTH) * 100;

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!person || state !== "answering") return;

      const correct = isCorrect(input, person.name);
      const newAnswered = answered + 1;
      setAnswered(newAnswered);

      if (correct) {
        setScore((s) => s + 1);
        if (newAnswered === QUIZ_LENGTH) {
          setState("answering");
        } else {
          setCurrent((c) => c + 1);
          setInput("");
          setImgError(false);
        }
      } else {
        setState("incorrect");
      }
    },
    [input, person, state, answered]
  );

  const handleNext = useCallback(() => {
    if (current + 1 >= QUIZ_LENGTH) return;
    setCurrent((c) => c + 1);
    setInput("");
    setState("answering");
    setImgError(false);
  }, [current]);

  const handleSkip = useCallback(() => {
    if (!person || state !== "answering") return;
    setState("incorrect");
    setAnswered((a) => a + 1);
  }, [person, state]);

  const handleRestart = useCallback(() => {
    setOrder(shuffle(persons.map((_, i) => i)));
    setCurrent(0);
    setInput("");
    setState("answering");
    setScore(0);
    setAnswered(0);
    setImgError(false);
  }, []);

  useEffect(() => {
    if (isFinished) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Enter") handleRestart();
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }

    if (state === "answering") {
      inputRef.current?.focus();
      return;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        if (answered < QUIZ_LENGTH) {
          handleNext();
        } else {
          setState("answering");
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [state, answered, isFinished, handleNext, handleRestart]);

  if (!person) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-sky-600 via-cyan-600 to-teal-500">
        <p className="text-lg text-white/80">Laden...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-sky-600 via-cyan-600 to-teal-500 font-sans">
      <main className="flex w-full max-w-md flex-col items-center gap-5 px-6 py-10">
        <h1 className="text-2xl font-bold tracking-tight text-white drop-shadow-md">Kabinet Jetten 1 Quiz</h1>

        <div className="w-full">
          <div className="mb-1.5 flex justify-between text-xs font-medium text-white/80">
            <span>{answered} / {QUIZ_LENGTH}</span>
            <span>{score} goed</span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/20">
            <div
              className="h-full rounded-full bg-gradient-to-r from-yellow-300 via-amber-400 to-orange-500 transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {isFinished ? (
          <div className="flex w-full flex-col items-center gap-5 rounded-2xl bg-white/95 p-8 shadow-xl backdrop-blur">
            <p className="text-xl font-bold text-gray-800">Klaar!</p>
            <p className="bg-gradient-to-r from-sky-600 to-teal-600 bg-clip-text text-5xl font-black text-transparent">
              {score} / {QUIZ_LENGTH}
            </p>
            <p className="text-gray-500">
              {score === QUIZ_LENGTH
                ? "Perfect! Je kent ze allemaal."
                : score >= QUIZ_LENGTH * 0.7
                  ? "Goed gedaan!"
                  : "Blijf oefenen!"}
            </p>
            <button
              onClick={handleRestart}
              className="rounded-xl bg-gradient-to-r from-sky-600 to-teal-600 px-8 py-3 text-sm font-semibold text-white shadow-lg transition-all active:scale-95 hover:from-sky-700 hover:to-teal-700"
            >
              Opnieuw spelen
            </button>
          </div>
        ) : (
          <div className="flex w-full flex-col items-center gap-4 rounded-2xl bg-white/95 p-5 shadow-xl backdrop-blur">
            <div className="relative h-64 w-48 overflow-hidden rounded-xl bg-gradient-to-b from-gray-100 to-gray-200 shadow-md ring-2 ring-white/50">
              {imgError ? (
                <div className="flex h-full w-full items-center justify-center text-gray-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={`/persons/${person.id}.jpg`} alt="Wie is dit?" className="h-full w-full object-cover" onError={() => setImgError(true)} />
              )}
            </div>

            <div className="flex flex-col items-center gap-1.5">
              <p className="text-center text-sm text-gray-500">{person.role}</p>
              <span className={`inline-block rounded-full px-3 py-0.5 text-xs font-bold shadow-sm ${partyColors[person.party] ?? "bg-gray-500 text-white"}`}>
                {person.party}
              </span>
            </div>

            {state === "answering" ? (
              <form onSubmit={handleSubmit} className="flex w-full flex-col gap-3">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Typ de naam..."
                  autoComplete="off"
                  className="w-full rounded-xl border-2 border-sky-200 bg-sky-50/50 px-4 py-3 text-center text-gray-800 outline-none transition-all focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
                />
                <div className="flex w-full gap-2">
                  <Link
                    href="/"
                    className="flex-1 rounded-xl bg-white px-4 py-3 text-center text-sm font-semibold text-gray-500 ring-1 ring-gray-200 transition-all hover:bg-gray-50"
                  >
                    Terug
                  </Link>
                  <button
                    type="button"
                    onClick={handleSkip}
                    className="flex-1 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-gray-500 ring-1 ring-gray-200 transition-all active:scale-95 hover:bg-gray-50"
                  >
                    Overslaan
                  </button>
                  <button
                    type="submit"
                    disabled={!input.trim()}
                    className="flex-[2] rounded-xl bg-gradient-to-r from-sky-600 to-teal-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition-all active:scale-95 hover:from-sky-700 hover:to-teal-700 disabled:opacity-40"
                  >
                    Controleer
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex w-full flex-col items-center gap-3">
                <div className="w-full rounded-xl bg-rose-50 px-4 py-3 text-center text-sm font-semibold text-rose-700 ring-1 ring-rose-200">
                  Onjuist. Het juiste antwoord is <span className="font-bold">{person.name}</span>.
                </div>
                {answered < QUIZ_LENGTH ? (
                  <button
                    onClick={handleNext}
                    className="rounded-xl bg-gradient-to-r from-sky-600 to-teal-600 px-8 py-3 text-sm font-semibold text-white shadow-md transition-all active:scale-95 hover:from-sky-700 hover:to-teal-700"
                  >
                    Volgende
                  </button>
                ) : (
                  <button
                    onClick={() => setState("answering")}
                    className="rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-8 py-3 text-sm font-semibold text-white shadow-md transition-all active:scale-95 hover:from-amber-600 hover:to-orange-600"
                  >
                    Bekijk resultaat
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
