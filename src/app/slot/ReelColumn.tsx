"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Person } from "../data";

const ITEM_H = 120;
const CONTAINER_H = 420;
const HALF = 5;

interface Props {
  type: "role" | "photo" | "name";
  label: string;
  items: Person[];
  onIndexChange: (actualIndex: number) => void;
  matchFlash: boolean;
}

export default function ReelColumn({ type, label, items, onIndexChange, matchFlash }: Props) {
  const N = items.length;

  // centerIdx: actual item index in items[] (0..N-1)
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

  // When item count changes (matched row removed), keep index in range.
  const prevNRef = useRef(N);
  useEffect(() => {
    const prevN = prevNRef.current;
    if (N > 0 && prevN > 0 && N !== prevN) {
      setCenterIdx((prev) => Math.min(prev, N - 1));
    } else if (N > 0 && prevN === 0) {
      setCenterIdx(0);
    }
    prevNRef.current = N;
  }, [N]);

  const getItem = (offset: number): Person => items[((centerIdx + offset) % N + N) % N];
  // translateY so center item sits exactly at payline.
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
          background: "radial-gradient(circle at 50% 14%, rgba(255,120,220,0.28) 0%, rgba(40,0,96,0.55) 35%, rgba(16,3,48,0.9) 68%, #050117 100%)",
          cursor: "grab",
          touchAction: "none",
          userSelect: "none",
          boxShadow: "inset 0 0 35px rgba(0,0,0,0.75), inset 0 0 40px rgba(194,55,255,0.3), 0 2px 8px rgba(0,0,0,0.6)",
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {/* Scrolling strip */}
        <div style={{
          transform: `translateY(${totalY}px)`,
          transition: animated ? "transform 0.35s cubic-bezier(0.2,0.8,0.3,1)" : "none",
          willChange: "transform",
        }}>
          {Array.from({ length: HALF * 2 + 1 }, (_, j) => {
            const offset = j - HALF;
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
                  padding: 0,
                  overflow: "hidden",
                  background: isCenter ? "rgba(255,220,0,0.06)" : "transparent",
                }}
              >
                {type === "photo" ? (
                  <div style={{
                    width: "100%",
                    height: "100%",
                    padding: 4,
                    borderRadius: 8,
                    background: matchFlash && isCenter ? "rgba(0,255,120,0.45)" : "transparent",
                  }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`/persons/${item.id}.jpg`}
                      alt=""
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover", objectPosition: "top",
                        borderRadius: 8,
                        display: "block",
                        border: matchFlash && isCenter
                          ? "3px solid #00ff88"
                          : "3px solid rgba(150,130,80,0.8)",
                      }}
                      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                    />
                  </div>
                ) : (
                  <div style={{ width: "100%", height: "100%", padding: "4px 0" }}>
                    <div style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: 8,
                      border: matchFlash && isCenter
                        ? "3px solid #00ff88"
                        : "3px solid rgba(150,130,80,0.8)",
                      background: matchFlash && isCenter
                        ? "rgba(0,255,120,0.55)"
                        : isCenter ? "rgba(250,245,232,0.96)" : "rgba(250,245,232,0.88)",
                      textAlign: "center",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "0 6px",
                    }}>
                      <div style={{
                        fontSize: type === "role" ? 10 : 12,
                        fontWeight: 600,
                        lineHeight: 1.3,
                        color: isCenter ? "#2a1d0a" : "rgba(42,29,10,0.78)",
                        overflow: "hidden",
                        display: "-webkit-box",
                        WebkitBoxOrient: "vertical",
                        WebkitLineClamp: type === "role" ? 4 : 2,
                      }}>
                        {type === "role" ? item.role : item.name}
                      </div>
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
          background: matchFlash ? "rgba(0,255,100,0.18)" : "transparent",
          animation: matchFlash ? "payline-flash 0.2s ease-in-out 5" : "none",
          pointerEvents: "none",
          zIndex: 4,
          transition: "background 0.2s",
        }} />

        {/* Top fade */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 80,
          background: "linear-gradient(180deg, rgba(9,2,35,0.98) 0%, rgba(24,5,64,0.55) 65%, transparent 100%)",
          pointerEvents: "none", zIndex: 3,
        }} />
        {/* Bottom fade */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 80,
          background: "linear-gradient(0deg, rgba(9,2,35,0.98) 0%, rgba(24,5,64,0.55) 65%, transparent 100%)",
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
