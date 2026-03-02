import { useState, useEffect } from "react";
import { ActiveRow, Chip } from "./useSlotGame";
import DropZone from "./DropZone";

interface Props {
  row: ActiveRow;
  roleChip: Chip | null;
  nameChip: Chip | null;
}

export default function SlotRow({ row, roleChip, nameChip }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  const isCorrect = row.status === "correct";
  const isExiting = row.status === "exiting";

  return (
    <div
      className="transition-all duration-500"
      style={{
        opacity: isExiting ? 0 : visible ? 1 : 0,
        transform: isExiting
          ? "translateY(-20px) scaleY(0.8)"
          : visible ? "translateY(0)" : "translateY(16px)",
      }}
    >
      <div
        className="relative grid grid-cols-3 gap-2 items-stretch rounded-xl overflow-hidden transition-all duration-300"
        style={{
          background: isCorrect
            ? "linear-gradient(180deg, rgba(0,200,80,0.3) 0%, rgba(0,150,60,0.2) 100%)"
            : "linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)",
          border: isCorrect
            ? "2px solid #00ff88"
            : "2px solid rgba(255,255,255,0.08)",
          boxShadow: isCorrect
            ? "0 0 20px rgba(0,255,100,0.5), inset 0 0 20px rgba(0,255,100,0.1)"
            : "inset 0 2px 4px rgba(0,0,0,0.4)",
        }}
      >
        {/* Correct flash overlay */}
        {isCorrect && (
          <div
            className="absolute inset-0 rounded-xl pointer-events-none"
            style={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 60%)",
              animation: "pulse 0.5s ease-in-out 2",
            }}
          />
        )}

        {/* Linker kolom: rol drop-zone */}
        <div
          className="rounded-l-lg overflow-hidden"
          style={{
            background: "linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(0,0,0,0.2) 100%)",
            borderRight: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <DropZone
            id={`role-drop-${row.personId}`}
            rowPersonId={row.personId}
            chipType="role"
            placedChip={roleChip}
            disabled={row.status !== "idle"}
          />
        </div>

        {/* Midden kolom: foto */}
        <div className="flex justify-center items-center py-2">
          <div
            className="relative overflow-hidden"
            style={{
              width: 72, height: 90,
              borderRadius: 10,
              border: isCorrect ? "2px solid #00ff88" : "2px solid rgba(255,255,255,0.2)",
              boxShadow: isCorrect
                ? "0 0 16px rgba(0,255,100,0.8)"
                : "0 4px 12px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1)",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/persons/${row.personId}.jpg`}
              alt=""
              className="w-full h-full object-cover object-top"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
            {/* Glass sheen */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 50%)",
              }}
            />
          </div>
        </div>

        {/* Rechter kolom: naam drop-zone */}
        <div
          className="rounded-r-lg overflow-hidden"
          style={{
            background: "linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(0,0,0,0.2) 100%)",
            borderLeft: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <DropZone
            id={`name-drop-${row.personId}`}
            rowPersonId={row.personId}
            chipType="name"
            placedChip={nameChip}
            disabled={row.status !== "idle"}
          />
        </div>
      </div>
    </div>
  );
}
