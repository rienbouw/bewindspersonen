"use client";

import { useEffect, useRef } from "react";
import { useSlotGame } from "./useSlotGame";
import SlotMachine from "./SlotMachine";
import ReelColumn from "./ReelColumn";

const MATCH_SOUND_SRC = "/sounds/casino-win.mp3";

function playMatchJingle(ctx: AudioContext) {
  const start = ctx.currentTime + 0.01;
  const notes = [659.25, 783.99, 987.77, 1318.51];

  notes.forEach((freq, i) => {
    const t = start + i * 0.075;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "square";
    osc.frequency.setValueAtTime(freq, t);
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(0.08, t + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.11);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.12);
  });
}

export default function SlotPage() {
  const {
    resetKey,
    roleItems, photoItems, nameItems,
    setRoleIndex, setPhotoIndex, setNameIndex,
    matchFlash,
    solved, total, finished,
    restart,
  } = useSlotGame();

  const audioCtxRef = useRef<AudioContext | null>(null);
  const matchAudioRef = useRef<HTMLAudioElement | null>(null);
  const audioUnlockedRef = useRef(false);
  const prevMatchFlashRef = useRef(false);

  const ensureAudioContext = () => {
    const AudioContextCtor =
      window.AudioContext ||
      (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextCtor) return null;
    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContextCtor();
    }
    return audioCtxRef.current;
  };

  useEffect(() => {
    const audio = new Audio(MATCH_SOUND_SRC);
    audio.preload = "auto";
    matchAudioRef.current = audio;

    return () => {
      if (!matchAudioRef.current) return;
      matchAudioRef.current.pause();
      matchAudioRef.current.src = "";
      matchAudioRef.current = null;
    };
  }, []);

  useEffect(() => {
    const unlockAudio = () => {
      if (audioUnlockedRef.current) return;
      audioUnlockedRef.current = true;

      const matchAudio = matchAudioRef.current;
      if (matchAudio) {
        matchAudio.muted = true;
        matchAudio.volume = 0;
        matchAudio.currentTime = 0;
        void matchAudio.play().then(() => {
          matchAudio.pause();
          matchAudio.currentTime = 0;
          matchAudio.muted = false;
          matchAudio.volume = 1;
        }).catch(() => {
          matchAudio.muted = false;
          matchAudio.volume = 1;
        });
      }

      const ctx = ensureAudioContext();
      if (ctx) void ctx.resume();
    };

    window.addEventListener("touchstart", unlockAudio, { passive: true });
    window.addEventListener("pointerdown", unlockAudio, { passive: true });
    window.addEventListener("keydown", unlockAudio);

    return () => {
      window.removeEventListener("touchstart", unlockAudio);
      window.removeEventListener("pointerdown", unlockAudio);
      window.removeEventListener("keydown", unlockAudio);
    };
  }, []);

  useEffect(() => {
    const hadMatch = prevMatchFlashRef.current;
    prevMatchFlashRef.current = matchFlash;
    if (!matchFlash || hadMatch) return;

    const matchAudio = matchAudioRef.current;
    if (matchAudio) {
      matchAudio.currentTime = 0;
      void matchAudio.play().catch(() => {
        const ctx = ensureAudioContext();
        if (!ctx) return;
        void ctx.resume().then(() => playMatchJingle(ctx));
      });
      return;
    }

    const ctx = ensureAudioContext();
    if (!ctx) return;
    void ctx.resume().then(() => playMatchJingle(ctx));
  }, [matchFlash]);

  useEffect(() => {
    return () => {
      if (!audioCtxRef.current) return;
      void audioCtxRef.current.close();
      audioCtxRef.current = null;
    };
  }, []);

  if (finished) {
    return (
      <div style={{
        minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
        background: "radial-gradient(ellipse at center,#1a0a3d 0%,#050010 100%)",
      }}>
        <div style={{ textAlign: "center", padding: 40 }}>
          <div style={{ fontSize: 80 }}>🏆</div>
          <div style={{
            fontSize: 36, fontWeight: 900, letterSpacing: "0.2em", textTransform: "uppercase",
            color: "#ffe000", textShadow: "0 0 20px #ffe000,0 0 40px #ff8800",
            marginTop: 16, marginBottom: 12,
          }}>Gefeliciteerd!</div>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 16, marginBottom: 24 }}>
            Je kent alle {total} bewindspersonen!
          </p>
          <button onClick={restart} style={{
            padding: "14px 40px", fontSize: 16, fontWeight: 900,
            letterSpacing: "0.15em", textTransform: "uppercase",
            borderRadius: 16, border: "none", cursor: "pointer",
            background: "linear-gradient(135deg,#ff8800,#ffdd00)",
            color: "#1a0800",
            boxShadow: "0 0 30px rgba(255,180,0,0.6)",
          }}>
            Opnieuw spelen
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh", fontFamily: "sans-serif",
      background: "radial-gradient(ellipse at top,#1a0a3d 0%,#050010 100%)",
      padding: "24px 12px",
    }}>
      <SlotMachine solved={solved} total={total}>
        <ReelColumn
          key={`role-${resetKey}`}
          type="role"
          label="Functie"
          items={roleItems}
          onIndexChange={setRoleIndex}
          matchFlash={matchFlash}
        />
        <ReelColumn
          key={`photo-${resetKey}`}
          type="photo"
          label="Foto"
          items={photoItems}
          onIndexChange={setPhotoIndex}
          matchFlash={matchFlash}
        />
        <ReelColumn
          key={`name-${resetKey}`}
          type="name"
          label="Naam"
          items={nameItems}
          onIndexChange={setNameIndex}
          matchFlash={matchFlash}
        />
      </SlotMachine>

      <div style={{ display: "flex", justifyContent: "center", marginTop: 16 }}>
        <button onClick={restart} style={{
          padding: "8px 24px", fontSize: 12, fontWeight: 700,
          letterSpacing: "0.15em", textTransform: "uppercase",
          borderRadius: 20, cursor: "pointer",
          background: "linear-gradient(135deg,#2a2a3a,#1a1a28)",
          color: "#888", border: "1px solid #444",
          boxShadow: "0 2px 8px rgba(0,0,0,0.5)",
        }}>
          ↺ Nieuw spel
        </button>
      </div>
    </div>
  );
}
