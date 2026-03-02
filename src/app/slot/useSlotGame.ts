import { useCallback, useEffect, useRef, useState } from "react";
import { persons, Person } from "../data";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function sortByRole(arr: Person[]): Person[] {
  return [...arr].sort((a, b) => a.role.localeCompare(b.role, "nl"));
}

function getLastNameSortKey(fullName: string): string {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length <= 1) return fullName.trim();
  const surname = parts.slice(1).join(" ");
  return surname.replace(/^(?:(?:van|von|de|den|der|te|ten|ter|'t)\s+)+/i, "");
}

function sortByName(arr: Person[]): Person[] {
  return [...arr].sort((a, b) => {
    const lastNameCmp = getLastNameSortKey(a.name).localeCompare(getLastNameSortKey(b.name), "nl");
    if (lastNameCmp !== 0) return lastNameCmp;
    return a.name.localeCompare(b.name, "nl");
  });
}

export type { Person };

export function useSlotGame() {
  const [resetKey, setResetKey] = useState(0);
  const [roleItems, setRoleItems] = useState<Person[]>(() => sortByRole(persons));
  const [photoItems, setPhotoItems] = useState<Person[]>(() => shuffle([...persons]));
  const [nameItems, setNameItems] = useState<Person[]>(() => sortByName(persons));

  const [roleIndex, setRoleIndex] = useState(0);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [nameIndex, setNameIndex] = useState(0);

  const solvedRef = useRef(new Set<string>());
  const matchedIdRef = useRef<string | null>(null);
  const [solvedCount, setSolvedCount] = useState(0);
  const [matchFlash, setMatchFlash] = useState(false);
  const [finished, setFinished] = useState(false);

  // Effect 1: detect a match at the payline immediately.
  useEffect(() => {
    if (matchFlash) return; // wait for the current flash to finish first

    const roleId = roleItems[roleIndex]?.id;
    const photoId = photoItems[photoIndex]?.id;
    const nameId = nameItems[nameIndex]?.id;

    if (!roleId || roleId !== photoId || photoId !== nameId) return;
    if (solvedRef.current.has(roleId)) return;

    solvedRef.current.add(roleId);
    setSolvedCount(solvedRef.current.size);
    matchedIdRef.current = roleId;
    setMatchFlash(true);
  }, [roleIndex, photoIndex, nameIndex, roleItems, photoItems, nameItems, matchFlash]);

  // Effect 2: react to matchFlash becoming true.
  // Removes the matched row after the flash and then clears the flash.
  // Only depends on matchFlash, so item-array changes never cancel the timer.
  useEffect(() => {
    if (!matchFlash) return;
    const id = matchedIdRef.current;
    if (!id) return;

    const timer = setTimeout(() => {
      // Remove matched person from all reels, then clear the flash in one batch
      setRoleItems((prev) => prev.filter((p) => p.id !== id));
      setPhotoItems((prev) => prev.filter((p) => p.id !== id));
      setNameItems((prev) => prev.filter((p) => p.id !== id));
      setMatchFlash(false);
      matchedIdRef.current = null;
      if (solvedRef.current.size >= persons.length) setFinished(true);
    }, 900);

    return () => clearTimeout(timer);
  }, [matchFlash]); // ← item arrays intentionally NOT in deps

  const restart = useCallback(() => {
    solvedRef.current = new Set();
    matchedIdRef.current = null;
    setSolvedCount(0);
    setRoleItems(sortByRole(persons));
    setPhotoItems(shuffle([...persons]));
    setNameItems(sortByName(persons));
    setRoleIndex(0);
    setPhotoIndex(0);
    setNameIndex(0);
    setMatchFlash(false);
    setFinished(false);
    setResetKey((k) => k + 1);
  }, []);

  return {
    resetKey,
    roleItems, photoItems, nameItems,
    roleIndex, setRoleIndex,
    photoIndex, setPhotoIndex,
    nameIndex, setNameIndex,
    matchFlash,
    solved: solvedCount,
    total: persons.length,
    finished,
    restart,
  };
}
