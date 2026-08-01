"use client";

import React, { useState, useEffect } from "react";
import { Flame, Plus, Trash2, ShieldAlert } from "lucide-react";
import { getRandomCards } from "./actions";
import GameEngine from "../src/components/GameEngine";

export default function Home() {
  const [gameState, setGameState] = useState<"menu" | "playing">("menu");
  const [players, setPlayers] = useState<string[]>([]);
  const [newPlayerName, setNewPlayerName] = useState("");
  const [cards, setCards] = useState<Array<{ id: string; content: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Load players from localStorage on client side mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("mqp_players");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length >= 2) {
            setPlayers(parsed);
            return;
          }
        } catch (e) {
          console.error("Failed to parse players from localStorage", e);
        }
      }
      setPlayers(["Jogador 1", "Jogador 2"]);
    }
  }, []);

  // Initialize AdMob and show Interstitial Ad on App Open
  useEffect(() => {
    const initAdMob = async () => {
      const cap = (window as any).Capacitor;
      if (cap && cap.Plugins && cap.Plugins.AdMob) {
        const AdMob = cap.Plugins.AdMob;
        try {
          await AdMob.initialize();
          
          const isAndroid = cap.getPlatform() === "android";
          const adId = isAndroid
            ? "ca-app-pub-3940256099942544/1033173712"
            : "ca-app-pub-3940256099942544/4411468910";
          
          await AdMob.prepareInterstitial({
            adId,
            isTesting: true,
          });

          // Show on App Open
          await AdMob.showInterstitial();
          
          // Prepare the next ad for when the user starts the game
          await AdMob.prepareInterstitial({
            adId,
            isTesting: true,
          });
        } catch (e) {
          console.error("AdMob initialization or app open ad failed:", e);
          // Try to prepare fallback in case of errors
          try {
            const isAndroid = cap.getPlatform() === "android";
            const adId = isAndroid
              ? "ca-app-pub-3940256099942544/1033173712"
              : "ca-app-pub-3940256099942544/4411468910";
            await AdMob.prepareInterstitial({
              adId,
              isTesting: true,
            });
          } catch (err) {
            console.error("Failed to prepare fallback ad:", err);
          }
        }
      }
    };

    if (typeof window !== "undefined") {
      if ((window as any).Capacitor) {
        initAdMob();
      } else {
        window.addEventListener("capacitorinit", initAdMob);
      }
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("capacitorinit", initAdMob);
      }
    };
  }, []);

  const handleAddPlayer = (e: React.FormEvent) => {
    e.preventDefault();
    const name = newPlayerName.trim();
    if (!name) return;
    if (players.includes(name)) {
      setErrorMsg("Esse nome de jogador já existe.");
      return;
    }
    const updated = [...players, name];
    setPlayers(updated);
    localStorage.setItem("mqp_players", JSON.stringify(updated));
    setNewPlayerName("");
    setErrorMsg("");
  };

  const handleRemovePlayer = (name: string) => {
    if (players.length <= 2) {
      setErrorMsg("Você precisa de pelo menos 2 jogadores.");
      return;
    }
    const updated = players.filter((p) => p !== name);
    setPlayers(updated);
    localStorage.setItem("mqp_players", JSON.stringify(updated));
    setErrorMsg("");
  };

  const handleStartGame = async () => {
    if (players.length < 2) {
      setErrorMsg("Insira pelo menos 2 jogadores para iniciar.");
      return;
    }
    
    setLoading(true);
    setErrorMsg("");
    
    try {
      const selectedCards = await getRandomCards(30);
      if (selectedCards.length < 30) {
        setErrorMsg("Não há cartas suficientes no banco de dados. Execute a semente primeiro.");
        setLoading(false);
        return;
      }
      setCards(selectedCards);

      // Trigger ad if Capacitor is available
      const cap = (window as any).Capacitor;
      if (cap && cap.Plugins && cap.Plugins.AdMob) {
        const AdMob = cap.Plugins.AdMob;
        try {
          await AdMob.showInterstitial();
        } catch (e) {
          console.error("Failed to show interstitial on game start:", e);
        } finally {
          // Always prepare the next ad in the background
          try {
            const isAndroid = cap.getPlatform() === "android";
            const adId = isAndroid
              ? "ca-app-pub-3940256099942544/1033173712"
              : "ca-app-pub-3940256099942544/4411468910";
            await AdMob.prepareInterstitial({
              adId,
              isTesting: true,
            });
          } catch (err) {
            console.error("Failed to prepare next ad:", err);
          }
        }
      }

      setGameState("playing");
    } catch (e) {
      console.error(e);
      setErrorMsg("Erro ao iniciar o jogo. Verifique sua conexão com o banco.");
    } finally {
      setLoading(false);
    }
  };

  if (gameState === "playing") {
    return (
      <GameEngine
        initialCards={cards}
        players={players}
        onBackToMenu={() => setGameState("menu")}
      />
    );
  }

  return (
    <div style={{ height: "100dvh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "10px", background: "radial-gradient(circle at center, #110729 0%, #030206 100%)", overflow: "hidden" }}>
      
      <div className="glass-container" style={{ width: "100%", maxWidth: "480px", textAlign: "center", display: "flex", flexDirection: "column", gap: "20px", maxHeight: "95vh", overflowY: "auto" }}>
        
        {/* GAME TITLE / LOGO */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
          <div style={{ animation: "float 4s ease-in-out infinite", position: "relative" }}>
            <Flame size={72} color="#ff007f" style={{ filter: "drop-shadow(0 0 15px #ff007f)" }} />
          </div>
          <h1 style={{ fontFamily: "var(--font-title)", fontSize: "40px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "2px", color: "#fff", textShadow: "0 0 15px rgba(255,0,127,0.7)" }}>
            Ma Que P#&*!
          </h1>
          <p style={{ color: "rgba(255, 255, 255, 0.6)", fontSize: "14px", lineHeight: "1.5" }}>
            O jogo de cartas mais picante e divertido para animar sua noite. Contagens rápidas de 7 segundos e desafios intensos.
          </p>
        </div>

        {/* PLAYER REGISTRATION FORM */}
        <div style={{ textAlign: "left", display: "flex", flexDirection: "column", gap: "12px" }}>
          <h3 style={{ textTransform: "uppercase", fontSize: "12px", letterSpacing: "1px", color: "rgba(255, 255, 255, 0.4)", marginBottom: "4px" }}>
            Jogadores ({players.length})
          </h3>
          
          {/* Add Player Input */}
          <form onSubmit={handleAddPlayer} style={{ display: "flex", gap: "8px" }}>
            <input
              type="text"
              placeholder="Nome do jogador..."
              className="input-neon"
              value={newPlayerName}
              onChange={(e) => setNewPlayerName(e.target.value)}
              maxLength={20}
            />
            <button type="submit" className="btn-neon" style={{ padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Plus size={20} />
            </button>
          </form>

          {/* Error Message */}
          {errorMsg && (
            <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#ff3333", fontSize: "13px", fontWeight: 500 }}>
              <ShieldAlert size={16} />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Players Chips List */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", maxHeight: "150px", overflowY: "auto", padding: "4px" }}>
            {players.map((player) => (
              <div key={player} style={{ display: "flex", alignItems: "center", gap: "8px", background: "rgba(138, 43, 226, 0.12)", border: "1px solid rgba(138, 43, 226, 0.25)", padding: "6px 12px", borderRadius: "20px", fontSize: "14px", fontWeight: 600 }}>
                <span>{player}</span>
                <button
                  type="button"
                  style={{ background: "transparent", border: "none", color: "rgba(255, 255, 255, 0.4)", cursor: "pointer", display: "flex", alignItems: "center" }}
                  onClick={() => handleRemovePlayer(player)}
                  onMouseOver={(e) => (e.currentTarget.style.color = "#ff3333")}
                  onMouseOut={(e) => (e.currentTarget.style.color = "rgba(255, 255, 255, 0.4)")}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* INICIAR BUTTON */}
        <button
          className="btn-neon btn-neon-pink"
          style={{ width: "100%", padding: "16px", fontSize: "18px", letterSpacing: "1.5px", animation: "pulse-pink 2s infinite" }}
          onClick={handleStartGame}
          disabled={loading}
        >
          {loading ? "Carregando..." : "Iniciar Jogo"}
        </button>

      </div>
      
    </div>
  );
}
