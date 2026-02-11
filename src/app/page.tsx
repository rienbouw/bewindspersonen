"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { persons } from "./data";

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
    .toLowerCase()
    .trim();
}

function isCorrect(input: string, name: string): boolean {
  const normalizedInput = normalize(input);
  if (!normalizedInput) return false;

  // Full name match
  if (normalizedInput === normalize(name)) return true;

  // Last name match (last word, or everything after first space)
  const parts = name.split(" ");
  const lastName = parts[parts.length - 1];
  if (normalizedInput === normalize(lastName)) return true;

  // Match on surname parts (e.g. "van den Brink" -> accept "Brink" or "van den Brink")
  // Find the first uppercase-starting word after the first name as start of surname
  const surnameParts = parts.slice(1);
  if (surnameParts.length > 0 && normalizedInput === normalize(surnameParts.join(" "))) return true;

  return false;
}

const partyColors: Record<string, string> = {
  D66: "bg-emerald-500 text-white",
  VVD: "bg-orange-500 text-white",
  CDA: "bg-blue-600 text-white",
  Partijloos: "bg-purple-500 text-white",
};

type QuizState = "answering" | "correct" | "incorrect";

export default function Home() {
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

  useEffect(() => {
    if (state === "answering") {
      inputRef.current?.focus();
    }
  }, [state, current]);

  const person = order.length > 0 ? persons[order[current]] : null;
  const isFinished = answered === persons.length;
  const progress = (answered / persons.length) * 100;

  const handleSubmit = useCallback(
    (e: React.SubmitEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!person || state !== "answering") return;

      if (isCorrect(input, person.name)) {
        setState("correct");
        setScore((s) => s + 1);
      } else {
        setState("incorrect");
      }
      setAnswered((a) => a + 1);
    },
    [input, person, state]
  );

  const handleNext = useCallback(() => {
    if (current + 1 >= persons.length) return;
    setCurrent((c) => c + 1);
    setInput("");
    setState("answering");
    setImgError(false);
  }, [current]);

  const handleRestart = useCallback(() => {
    setOrder(shuffle(persons.map((_, i) => i)));
    setCurrent(0);
    setInput("");
    setState("answering");
    setScore(0);
    setAnswered(0);
    setImgError(false);
  }, []);

  if (!person) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
        <p className="text-lg text-white/80">Laden...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 font-sans">
      <main className="flex w-full max-w-md flex-col items-center gap-5 px-6 py-10">
        <h1 className="text-2xl font-bold tracking-tight text-white drop-shadow-md">
          Bewindspersonen Quiz
        </h1>

        {/* Progress bar */}
        <div className="w-full">
          <div className="flex justify-between text-xs font-medium text-white/80 mb-1.5">
            <span>{answered} / {persons.length}</span>
            <span>{score} goed</span>
          </div>
          <div className="h-2.5 w-full rounded-full bg-white/20 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-500 transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {isFinished ? (
          <div className="flex w-full flex-col items-center gap-5 rounded-2xl bg-white/95 p-8 shadow-xl backdrop-blur">
            <div className="text-5xl">
              {score === persons.length ? "🏆" : score >= persons.length * 0.7 ? "🎉" : "📚"}
            </div>
            <p className="text-xl font-bold text-gray-800">
              Klaar!
            </p>
            <p className="text-5xl font-black bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">
              {score} / {persons.length}
            </p>
            <p className="text-gray-500">
              {score === persons.length
                ? "Perfect! Je kent ze allemaal."
                : score >= persons.length * 0.7
                  ? "Goed gedaan!"
                  : "Blijf oefenen!"}
            </p>
            <button
              onClick={handleRestart}
              className="rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-3 text-sm font-semibold text-white shadow-lg hover:from-indigo-700 hover:to-purple-700 transition-all active:scale-95"
            >
              Opnieuw spelen
            </button>
          </div>
        ) : (
          <div className="flex w-full flex-col items-center gap-4 rounded-2xl bg-white/95 p-5 shadow-xl backdrop-blur">
            {/* Photo */}
            <div className="relative h-64 w-48 overflow-hidden rounded-xl bg-gradient-to-b from-gray-100 to-gray-200 shadow-md ring-2 ring-white/50">
              {imgError ? (
                <div className="flex h-full w-full items-center justify-center text-gray-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={`/persons/${person.id}.jpg`}
                  alt="Wie is dit?"
                  className="h-full w-full object-cover"
                  onError={() => setImgError(true)}
                />
              )}
            </div>

            {/* Role hint */}
            <div className="flex flex-col items-center gap-1.5">
              <p className="text-center text-sm text-gray-500">
                {person.role}
              </p>
              <span className={`inline-block rounded-full px-3 py-0.5 text-xs font-bold shadow-sm ${partyColors[person.party] ?? "bg-gray-500 text-white"}`}>
                {person.party}
              </span>
            </div>

            {/* Answer form */}
            {state === "answering" ? (
              <form onSubmit={handleSubmit} className="flex w-full flex-col gap-3">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Typ de naam..."
                  autoComplete="off"
                  className="w-full rounded-xl border-2 border-indigo-200 bg-indigo-50/50 px-4 py-3 text-center text-gray-800 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 transition-all"
                />
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-md hover:from-indigo-700 hover:to-purple-700 disabled:opacity-40 disabled:hover:from-indigo-600 disabled:hover:to-purple-600 transition-all active:scale-95"
                >
                  Controleer
                </button>
              </form>
            ) : (
              <div className="flex w-full flex-col items-center gap-3">
                <div
                  className={`w-full rounded-xl px-4 py-3 text-center text-sm font-semibold ${
                    state === "correct"
                      ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                      : "bg-rose-50 text-rose-700 ring-1 ring-rose-200"
                  }`}
                >
                  {state === "correct" ? (
                    <>&#10003; Goed! Het is {person.name}.</>
                  ) : (
                    <>
                      &#10007; Helaas! Het juiste antwoord is{" "}
                      <span className="font-bold">{person.name}</span>.
                    </>
                  )}
                </div>
                {current + 1 < persons.length ? (
                  <button
                    onClick={handleNext}
                    className="rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-3 text-sm font-semibold text-white shadow-md hover:from-indigo-700 hover:to-purple-700 transition-all active:scale-95"
                  >
                    Volgende
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setCurrent((c) => c + 1);
                    }}
                    className="rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-8 py-3 text-sm font-semibold text-white shadow-md hover:from-amber-600 hover:to-orange-600 transition-all active:scale-95"
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
