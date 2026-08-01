"use client";

import { Flame, Plus, ShieldAlert, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import GameEngine from "../src/components/GameEngine";
import { getRandomCards } from "./actions";

export default function Home() {
  const [gameState, setGameState] = useState<"menu" | "playing">("menu");
  const [players, setPlayers] = useState<string[]>([]);
  const [newPlayerName, setNewPlayerName] = useState("");
  const [cards, setCards] = useState<Array<{ id: string; content: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [is18ModalOpen, setIs18ModalOpen] = useState(false);
  const [isPromoAdModalOpen, setIsPromoAdModalOpen] = useState(false);

  // Load players from localStorage and check 18+ consent on client side mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("mqp_players");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length >= 2) {
            setPlayers(parsed);
          } else {
            setPlayers(["Jogador 1", "Jogador 2"]);
          }
        } catch (e) {
          console.error("Failed to parse players from localStorage", e);
          setPlayers(["Jogador 1", "Jogador 2"]);
        }
      } else {
        setPlayers(["Jogador 1", "Jogador 2"]);
      }

      // Check 18+ consent
      const consent = localStorage.getItem("mqp_18_consent");
      if (consent !== "true") {
        setIs18ModalOpen(true);
      }
    }
  }, []);

  // Initialize AdMob, show Interstitial Ad on App Open, and prepare Rewarded Video
  useEffect(() => {
    const initAdMob = async () => {
      const cap = (window as any).Capacitor;
      if (cap && cap.Plugins && cap.Plugins.AdMob) {
        const AdMob = cap.Plugins.AdMob;
        try {
          await AdMob.initialize();
          
          const isAndroid = cap.getPlatform() === "android";
          const interstitialId = isAndroid
            ? "ca-app-pub-8691674404508428/8379424132"
            : "ca-app-pub-3940256099942544/4411468910";
          
          await AdMob.prepareInterstitial({
            adId: interstitialId,
            isTesting: false,
          });

          // Show Interstitial on App Open
          await AdMob.showInterstitial();
          
          // Prepare the REWARDED VIDEO for when the user starts the game
          const rewardedId = isAndroid
            ? "ca-app-pub-8691674404508428/2489517211"
            : "ca-app-pub-3940256099942544/1712485313";
          
          await AdMob.prepareRewardVideoAd({
            adId: rewardedId,
            isTesting: false,
          });
        } catch (e) {
          console.error("AdMob initialization or app open ad failed:", e);
          // Try to prepare fallback rewarded ad in case of errors
          try {
            const isAndroid = cap.getPlatform() === "android";
            const rewardedId = isAndroid
              ? "ca-app-pub-8691674404508428/2489517211"
              : "ca-app-pub-3940256099942544/1712485313";
            await AdMob.prepareRewardVideoAd({
              adId: rewardedId,
              isTesting: false,
            });
          } catch (err) {
            console.error("Failed to prepare fallback rewarded ad:", err);
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

  const proceedToGame = async () => {
    setLoading(true);
    try {
      const selectedCards = await getRandomCards(30);
      if (selectedCards.length < 30) {
        setErrorMsg("Não há cartas suficientes no banco de dados. Execute a semente primeiro.");
        setLoading(false);
        return;
      }
      setCards(selectedCards);
      setGameState("playing");
    } catch (e) {
      console.error(e);
      setErrorMsg("Erro ao iniciar o jogo. Verifique sua conexão com o banco.");
    } finally {
      setLoading(false);
    }
  };

  const handleStartGame = async () => {
    if (players.length < 2) {
      setErrorMsg("Insira pelo menos 2 jogadores para iniciar.");
      return;
    }
    
    setErrorMsg("");

    // Trigger ad confirmation if Capacitor is available
    const cap = (window as any).Capacitor;
    if (cap && cap.Plugins && cap.Plugins.AdMob) {
      setIsPromoAdModalOpen(true);
    } else {
      // On browser, start directly
      await proceedToGame();
    }
  };

  const handleShowRewardedAd = async () => {
    setIsPromoAdModalOpen(false);
    setLoading(true);

    const cap = (window as any).Capacitor;
    if (cap && cap.Plugins && cap.Plugins.AdMob) {
      const AdMob = cap.Plugins.AdMob;
      try {
        await AdMob.showRewardVideoAd();
      } catch (e) {
        console.error("Failed to show rewarded video:", e);
      } finally {
        // Re-prepare the next rewarded ad in the background
        try {
          const isAndroid = cap.getPlatform() === "android";
          const rewardedId = isAndroid
            ? "ca-app-pub-8691674404508428/2489517211"
            : "ca-app-pub-3940256099942544/1712485313";
          await AdMob.prepareRewardVideoAd({
            adId: rewardedId,
            isTesting: false,
          });
        } catch (err) {
          console.error("Failed to prepare next rewarded ad:", err);
        }
      }
    }

    // Start game in either case
    await proceedToGame();
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

      {/* Footer Links */}
      <div style={{
        marginTop: "16px",
        display: "flex",
        gap: "16px",
        justifyContent: "center",
        fontSize: "12px",
        zIndex: 10
      }}>
        <Link href="/termos" style={{ color: "rgba(255, 255, 255, 0.4)", textDecoration: "none", transition: "color 0.2s" }}
          onMouseOver={(e) => (e.currentTarget.style.color = "rgba(255, 255, 255, 0.8)")}
          onMouseOut={(e) => (e.currentTarget.style.color = "rgba(255, 255, 255, 0.4)")}
        >
          Termos de Uso
        </Link>
        <span style={{ color: "rgba(255, 255, 255, 0.2)" }}>|</span>
        <Link href="/politica" style={{ color: "rgba(255, 255, 255, 0.4)", textDecoration: "none", transition: "color 0.2s" }}
          onMouseOver={(e) => (e.currentTarget.style.color = "rgba(255, 255, 255, 0.8)")}
          onMouseOut={(e) => (e.currentTarget.style.color = "rgba(255, 255, 255, 0.4)")}
        >
          Política de Privacidade
        </Link>
      </div>

      {/* 18+ MODAL */}
      {is18ModalOpen && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100dvh",
          backgroundColor: "rgba(3, 2, 6, 0.96)",
          zIndex: 9999,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "20px"
        }}>
          <div className="glass-container" style={{
            width: "100%",
            maxWidth: "420px",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            padding: "30px",
            border: "1px solid rgba(255, 0, 127, 0.3)",
            boxShadow: "0 0 30px rgba(255, 0, 127, 0.2)",
            background: "rgba(20, 10, 35, 0.75)",
            backdropFilter: "blur(20px)",
            borderRadius: "16px"
          }}>
            <Flame size={48} color="#ff007f" style={{ margin: "0 auto", filter: "drop-shadow(0 0 10px #ff007f)" }} />
            <h2 style={{ fontSize: "24px", fontWeight: 800, color: "#fff", textTransform: "uppercase", letterSpacing: "1px", margin: 0 }}>
              Verificação de Idade
            </h2>
            <p style={{ color: "rgba(255, 255, 255, 0.7)", fontSize: "14px", lineHeight: "1.6", margin: 0 }}>
              Este aplicativo contém desafios, perguntas picantes e dinâmicas voltadas exclusivamente para o público adulto.
            </p>
            <p style={{ color: "rgba(255, 255, 255, 0.7)", fontSize: "14px", lineHeight: "1.6", margin: 0 }}>
              Ao continuar, você confirma que possui <strong>18 anos ou mais</strong> e concorda com os nossos{" "}
              <Link
                href="/termos"
                style={{
                  color: "#ff007f",
                  textDecoration: "underline",
                  fontWeight: 600,
                  fontSize: "14px"
                }}
              >
                Termos de Uso
              </Link>{" "}
              e{" "}
              <Link
                href="/politica"
                style={{
                  color: "#ff007f",
                  textDecoration: "underline",
                  fontWeight: 600,
                  fontSize: "14px"
                }}
              >
                Política de Privacidade
              </Link>.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "10px" }}>
              <button
                className="btn-neon btn-neon-pink"
                style={{ width: "100%", padding: "14px", fontSize: "16px", fontWeight: 700 }}
                onClick={() => {
                  localStorage.setItem("mqp_18_consent", "true");
                  setIs18ModalOpen(false);
                }}
              >
                Sim, sou maior de 18 anos
              </button>
              <button
                type="button"
                style={{
                  width: "100%",
                  padding: "14px",
                  fontSize: "16px",
                  fontWeight: 600,
                  backgroundColor: "transparent",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  color: "rgba(255,255,255,0.6)",
                  borderRadius: "8px",
                  cursor: "pointer"
                }}
                onClick={() => {
                  alert("Você precisa ser maior de 18 anos para acessar este aplicativo.");
                  if (typeof window !== "undefined") {
                    window.location.href = "https://www.google.com";
                  }
                }}
              >
                Não, sair
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PROMO AD MODAL */}
      {isPromoAdModalOpen && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100dvh",
          backgroundColor: "rgba(3, 2, 6, 0.9)",
          zIndex: 9998,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "20px"
        }}>
          <div className="glass-container" style={{
            width: "100%",
            maxWidth: "420px",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            padding: "30px",
            border: "1px solid rgba(138, 43, 226, 0.3)",
            boxShadow: "0 0 30px rgba(138, 43, 226, 0.2)",
            background: "rgba(20, 10, 35, 0.75)",
            backdropFilter: "blur(20px)",
            borderRadius: "16px"
          }}>
            <h2 style={{ fontSize: "22px", fontWeight: 800, color: "#fff", textTransform: "uppercase", letterSpacing: "1px", margin: 0 }}>
              Vídeo Promocional
            </h2>
            <p style={{ color: "rgba(255, 255, 255, 0.7)", fontSize: "14px", lineHeight: "1.6", margin: 0 }}>
              Para iniciar o jogo, você assistirá a um breve vídeo promocional. Isso nos ajuda a manter o aplicativo gratuito!
            </p>
            <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
              <button
                className="btn-neon"
                style={{ flex: 1, padding: "14px", fontSize: "16px", fontWeight: 700 }}
                onClick={handleShowRewardedAd}
              >
                Assistir e Jogar
              </button>
              <button
                type="button"
                style={{
                  flex: 1,
                  padding: "14px",
                  fontSize: "16px",
                  fontWeight: 600,
                  backgroundColor: "transparent",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  color: "rgba(255,255,255,0.6)",
                  borderRadius: "8px",
                  cursor: "pointer"
                }}
                onClick={() => setIsPromoAdModalOpen(false)}
              >
                Voltar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
