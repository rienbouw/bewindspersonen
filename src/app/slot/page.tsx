"use client";

import { useSlotGame } from "./useSlotGame";
import SlotMachine from "./SlotMachine";
import ReelColumn from "./ReelColumn";

export default function SlotPage() {
  const {
    resetKey,
    roleItems, photoItems, nameItems,
    setRoleIndex, setPhotoIndex, setNameIndex,
    matchFlash,
    solved, total, finished,
    restart,
  } = useSlotGame();

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
