"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Person } from "../data";

const ITEM_H = 70;
const CONTAINER_H = 350;
const HALF = 5; // items shown on each side of the payline

interface Props {
  type: "role" | "photo" | "name";
  label: string;
  items: Person[];
  onIndexChange: (actualIndex: number) => void;
  matchFlash: boolean;
}

export default function ReelColumn({ type, label, items, onIndexChange, matchFlash }: Props) {
  const N = items.length;

  // centerIdx: which item is at the payline (actual index into items[])
  const [centerIdx, setCenterIdx] = useState(0);
  // dragOffset: how many px the strip is shifted during a drag (positive = drag down)
  const [dragOffset, setDragOffset] = useState(0);
  // animated: whether the snap CSS transition is active
  const [animated, setAnimated] = useState(false);

  const isDragging = useRef(false);
  const startY = useRef(0);
  const velocityRef = useRef(0);
  const lastYRef = useRef(0);
  const lastTimeRef = useRef(0);

  // Keep parent index in sync whenever centerIdx or N changes
  useEffect(() => {
    if (N > 0) onIndexChange(((centerIdx % N) + N) % N);
  }, [centerIdx, N, onIndexChange]);

  // When items are removed, clamp centerIdx so it stays in range
  const prevNRef = useRef(N);
  useEffect(() => {
    if (N < prevNRef.current && N > 0) {
      setCenterIdx((prev) => Math.min(prev, N - 1));
    }
    prevNRef.current = N;
  }, [N]);

  // Return the item at `offset` positions from the center (circular)
  const getItem = (offset: number): Person =>
    items[((centerIdx + offset) % N + N) % N];

  // translateY so the center item sits exactly at the payline
  const baseY = CONTAINER_H / 2 - (HALF + 0.5) * ITEM_H;
  const totalY = baseY + dragOffset;

  const doSnap = useCallback(
    (totalDragDelta: number) => {
      const velPx = velocityRef.current * 150; // project 150 ms forward
      const indexDelta = -Math.round((totalDragDelta + velPx) / ITEM_H);
      const snapDragOffset = -indexDelta * ITEM_H; // where the strip should rest

      setAnimated(true);
      setDragOffset(snapDragOffset);

      // After the CSS transition, atomically reset dragOffset→0 and advance centerIdx.
      // Because animated=false disables the transition, the translateY stays identical
      // (new centerIdx * ITEM_H = old centerIdx * ITEM_H + snapDragOffset).
      setTimeout(() => {
        setAnimated(false);
        setCenterIdx((prev) => ((prev + indexDelta) % N + N) % N);
        setDragOffset(0);
      }, 360);
    },
    [N]
  );

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    isDragging.current = true;
    startY.current = e.clientY;
    lastYRef.current = e.clientY;
    lastTimeRef.current = e.timeStamp;
    velocityRef.current = 0;
    setAnimated(false); // cancel any in-progress snap
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging.current) return;
    setDragOffset(e.clientY - startY.current);
    const dt = e.timeStamp - lastTimeRef.current;
    if (dt > 5) {
      velocityRef.current = (e.clientY - lastYRef.current) / dt; // px/ms
    }
    lastYRef.current = e.clientY;
    lastTimeRef.current = e.timeStamp;
  }, []);

  const onPointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging.current) return;
      isDragging.current = false;
      doSnap(e.clientY - startY.current);
    },
    [doSnap]
  );

  if (N === 0) return null;

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 0 }}>
      <style>{`
        @keyframes payline-flash {
          0%, 100% { background: rgba(0,255,100,0.18); border-color: #00ff88; }
          50%       { background: rgba(0,255,100,0.45); border-color: #88ffcc; }
        }
      `}</style>


      {/* Reel window */}
      <div
        style={{
          position: "relative",
          height: CONTAINER_H,
          overflow: "hidden",
          borderRadius: 12,
          border: "3px solid rgba(150,130,80,0.8)",
          background: "#080818",
          cursor: "grab",
          touchAction: "none",
          userSelect: "none",
          boxShadow: "inset 0 0 30px rgba(0,0,0,0.8), 0 2px 8px rgba(0,0,0,0.6)",
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {/* Scrolling strip — renders HALF*2+1 items around the center */}
        <div style={{
          transform: `translateY(${totalY}px)`,
          transition: animated ? "transform 0.35s cubic-bezier(0.2,0.8,0.3,1)" : "none",
          willChange: "transform",
        }}>
          {Array.from({ length: HALF * 2 + 1 }, (_, j) => {
            const offset = j - HALF; // -5 … +5
            const item = getItem(offset);
            const isCenter = offset === 0;

            return (
              <div
                key={j}
                style={{
                  height: ITEM_H,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "0 8px",
                  background: isCenter ? "rgba(255,220,0,0.06)" : "transparent",
                  borderBottom: "1px solid rgba(255,255,255,0.05)",
                }}
              >
                {type === "photo" ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={`/persons/${item.id}.jpg`}
                    alt=""
                    style={{
                      width: 42, height: 56,
                      objectFit: "cover", objectPosition: "top",
                      borderRadius: 6, display: "block",
                      border: isCenter
                        ? "2px solid rgba(255,220,0,0.6)"
                        : "2px solid rgba(255,255,255,0.1)",
                    }}
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                ) : (
                  <div style={{ textAlign: "center", width: "100%" }}>
                    <div style={{
                      fontSize: type === "role" ? 9 : 11,
                      fontWeight: 600,
                      lineHeight: 1.35,
                      color: isCenter ? "#ffffff" : "rgba(255,255,255,0.35)",
                    }}>
                      {type === "role" ? item.role : item.name}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Payline border — highlights the center row */}
        <div style={{
          position: "absolute",
          left: 0, right: 0,
          top: CONTAINER_H / 2 - ITEM_H / 2,
          height: ITEM_H,
          borderTop: matchFlash ? "2px solid #00ff88" : "2px solid rgba(255,220,0,0.55)",
          borderBottom: matchFlash ? "2px solid #00ff88" : "2px solid rgba(255,220,0,0.55)",
          background: matchFlash ? "rgba(0,255,100,0.18)" : "transparent",
          animation: matchFlash ? "payline-flash 0.2s ease-in-out 5" : "none",
          pointerEvents: "none",
          zIndex: 4,
          transition: "border-color 0.2s, background 0.2s",
        }} />

        {/* Top fade */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 80,
          background: "linear-gradient(180deg, rgba(8,8,24,0.98) 0%, rgba(8,8,24,0.5) 65%, transparent 100%)",
          pointerEvents: "none", zIndex: 3,
        }} />
        {/* Bottom fade */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 80,
          background: "linear-gradient(0deg, rgba(8,8,24,0.98) 0%, rgba(8,8,24,0.5) 65%, transparent 100%)",
          pointerEvents: "none", zIndex: 3,
        }} />

        {/* Side reflections */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(90deg, rgba(255,255,255,0.04) 0%, transparent 18%, transparent 82%, rgba(255,255,255,0.04) 100%)",
          pointerEvents: "none", zIndex: 1, borderRadius: 10,
        }} />
      </div>
    </div>
  );
}
