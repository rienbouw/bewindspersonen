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

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
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
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
        <p className="text-lg text-zinc-500">Laden...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full max-w-md flex-col items-center gap-6 px-6 py-12">
        <h1 className="text-2xl font-semibold tracking-tight text-black dark:text-zinc-50">
          Bewindspersonen Quiz
        </h1>

        <div className="text-sm text-zinc-500">
          {answered} / {persons.length} beantwoord &middot; {score} goed
        </div>

        {isFinished ? (
          <div className="flex flex-col items-center gap-6 rounded-xl bg-white p-8 shadow-sm dark:bg-zinc-900">
            <p className="text-xl font-medium text-black dark:text-white">
              Klaar!
            </p>
            <p className="text-4xl font-bold text-black dark:text-white">
              {score} / {persons.length}
            </p>
            <p className="text-zinc-500">
              {score === persons.length
                ? "Perfect! Je kent ze allemaal."
                : score >= persons.length * 0.7
                  ? "Goed gedaan!"
                  : "Blijf oefenen!"}
            </p>
            <button
              onClick={handleRestart}
              className="rounded-lg bg-black px-6 py-2.5 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
            >
              Opnieuw
            </button>
          </div>
        ) : (
          <div className="flex w-full flex-col items-center gap-5 rounded-xl bg-white p-6 shadow-sm dark:bg-zinc-900">
            {/* Photo */}
            <div className="relative h-64 w-48 overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-800">
              {imgError ? (
                <div className="flex h-full w-full items-center justify-center text-zinc-400">
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
            <p className="text-center text-sm text-zinc-500">
              {person.role}
              <span className="ml-2 inline-block rounded bg-zinc-100 px-1.5 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                {person.party}
              </span>
            </p>

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
                  className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-center text-black outline-none focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:focus:border-zinc-500"
                />
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="rounded-lg bg-black px-6 py-2.5 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-40 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                >
                  Controleer
                </button>
              </form>
            ) : (
              <div className="flex w-full flex-col items-center gap-3">
                <div
                  className={`w-full rounded-lg px-4 py-3 text-center text-sm font-medium ${
                    state === "correct"
                      ? "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                  }`}
                >
                  {state === "correct" ? (
                    <>Goed! Het is {person.name}.</>
                  ) : (
                    <>
                      Helaas! Het juiste antwoord is{" "}
                      <span className="font-bold">{person.name}</span>.
                    </>
                  )}
                </div>
                {current + 1 < persons.length ? (
                  <button
                    onClick={handleNext}
                    className="rounded-lg bg-black px-6 py-2.5 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                  >
                    Volgende
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setCurrent((c) => c + 1);
                    }}
                    className="rounded-lg bg-black px-6 py-2.5 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
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
