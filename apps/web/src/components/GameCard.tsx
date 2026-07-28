"use client";

import React from "react";
import { Flame, Sparkles } from "lucide-react";

interface GameCardProps {
  content: string;
  player: string;
  isFlipped: boolean;
  onFlip: () => void;
  index: number;
}

export default function GameCard({ content, player, isFlipped, onFlip, index }: GameCardProps) {
  return (
    <div className="card-perspective" onClick={onFlip}>
      <div className={`card-inner ${isFlipped ? "flipped" : ""}`}>
        {/* BACK SIDE (Facedown - Purple Theme) */}
        <div className="card-back">
          <div style={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center" }}>
            <span style={{ fontSize: "14px", fontWeight: 600, color: "rgba(255, 255, 255, 0.4)", textTransform: "uppercase", letterSpacing: "1.5px" }}>
              Carta {index + 1}
            </span>
            <Flame size={20} color="#8a2be2" style={{ filter: "drop-shadow(0 0 5px #8a2be2)" }} />
          </div>
          
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: "20px" }}>
            <div style={{ position: "relative" }}>
              <Flame size={72} color="#ff007f" style={{ filter: "drop-shadow(0 0 15px #ff007f)" }} />
            </div>
            <h2 style={{ fontFamily: "var(--font-title)", fontSize: "28px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "2px", color: "#fff", textShadow: "0 0 10px rgba(138,43,226,0.6)" }}>
              Ma Que P#&*!
            </h2>
            <p style={{ fontSize: "14px", color: "rgba(255, 255, 255, 0.6)", letterSpacing: "1px", textTransform: "uppercase" }}>
              Vez de <strong style={{ color: "#ff007f" }}>{player}</strong>
            </p>
          </div>
          
          <div style={{ textAlign: "center" }}>
            <span style={{ fontSize: "13px", padding: "8px 16px", borderRadius: "20px", background: "rgba(138, 43, 226, 0.2)", border: "1px solid rgba(138, 43, 226, 0.3)", color: "#dfc7ff", textTransform: "uppercase", letterSpacing: "1px" }}>
              Toque para virar
            </span>
          </div>
        </div>

        {/* FRONT SIDE (Revealed - Pink/Black Theme) */}
        <div className="card-front" onClick={(e) => e.stopPropagation()}>
          <div style={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center" }}>
            <span style={{ fontSize: "14px", fontWeight: 600, color: "rgba(255, 255, 255, 0.4)", textTransform: "uppercase" }}>
              Desafio
            </span>
            <Sparkles size={20} color="#ff007f" style={{ filter: "drop-shadow(0 0 5px #ff007f)" }} />
          </div>

          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "0 10px" }}>
            <p style={{ fontSize: "20px", lineHeight: "1.6", fontWeight: 500, color: "#fff", textShadow: "0 2px 10px rgba(0,0,0,0.5)", wordBreak: "break-word" }}>
              {content}
            </p>
          </div>

          <div style={{ width: "100%", borderTop: "1px solid rgba(255, 0, 127, 0.2)", paddingTop: "15px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "12px", color: "rgba(255, 255, 255, 0.4)" }}>
              Jogador: <strong style={{ color: "#ff007f" }}>{player}</strong>
            </span>
            <span style={{ fontSize: "12px", color: "rgba(255, 255, 255, 0.4)" }}>
              #{index + 1}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
