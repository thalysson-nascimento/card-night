"use client";

import { Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import GameEngine from "../src/components/GameEngine";
import { getRandomCards } from "./actions";
import styles from "./page.module.css";

export default function Home() {
  const [gameState, setGameState] = useState<"menu" | "playing">("menu");
  const [players, setPlayers] = useState<string[]>([]);
  const [newPlayerName, setNewPlayerName] = useState("");
  const [cards, setCards] = useState<Array<{ id: string; content: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isInputShaking, setIsInputShaking] = useState(false);

  const [isPromoAdModalOpen, setIsPromoAdModalOpen] = useState(false);
  const [isPlayerRewardModalOpen, setIsPlayerRewardModalOpen] = useState(false);
  const [isPlayerRewardLoading, setIsPlayerRewardLoading] = useState(false);
  const [extraPlayersUnlocked, setExtraPlayersUnlocked] = useState(false);
  const [showLegalConsent, setShowLegalConsent] = useState(() => {
    if (typeof window === "undefined") return false;

    try {
      return localStorage.getItem("cards_night_legal_consent_v1") !== "true";
    } catch {
      return true;
    }
  });
  const playerInputRef = useRef<HTMLInputElement>(null);
  const shakeTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        setShowLegalConsent(localStorage.getItem("cards_night_legal_consent_v1") !== "true");
        setExtraPlayersUnlocked(
          localStorage.getItem("cards_night_extra_players_v1") === "true"
        );
      } catch {
        setShowLegalConsent(true);
      }

      const saved = localStorage.getItem("mqp_players");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            setPlayers(parsed);
          } else {
            setPlayers([]);
          }
        } catch (e) {
          console.error("Failed to parse players from localStorage", e);
          setPlayers([]);
        }
      }
    }
  }, []);

  useEffect(() => {
    return () => {
      if (shakeTimeoutRef.current !== null) {
        window.clearTimeout(shakeTimeoutRef.current);
      }
    };
  }, []);

  const acceptLegalTerms = () => {
    try {
      localStorage.setItem("cards_night_legal_consent_v1", "true");
    } catch {
      // The modal can still close for this session if storage is unavailable.
    }
    setShowLegalConsent(false);
  };

  useEffect(() => {
    if (!errorMsg) return;

    const timeout = window.setTimeout(() => setErrorMsg(""), 2800);
    return () => window.clearTimeout(timeout);
  }, [errorMsg]);

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
            isTesting: true,
          });

          // Show Interstitial on App Open
          await AdMob.showInterstitial();
          
          // Prepare the REWARDED VIDEO for when the user starts the game
          const rewardedId = isAndroid
            ? "ca-app-pub-8691674404508428/2489517211"
            : "ca-app-pub-3940256099942544/1712485313";
          
          await AdMob.prepareRewardVideoAd({
            adId: rewardedId,
            isTesting: true,
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
              isTesting: true,
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
    if (!name) {
      triggerInputShake();
      playerInputRef.current?.focus();
      return;
    }
    if (players.some((player) => player.toLowerCase() === name.toLowerCase())) {
      setErrorMsg("Esse nome de jogador já existe.");
      return;
    }
    if (players.length >= 6 && !extraPlayersUnlocked) {
      setIsPlayerRewardModalOpen(true);
      return;
    }
    if (players.length >= 12) {
      setErrorMsg("Limite máximo de 12 jogadores atingido.");
      return;
    }
    const updated = [...players, name];
    setPlayers(updated);
    localStorage.setItem("mqp_players", JSON.stringify(updated));
    setNewPlayerName("");
    setErrorMsg("");
  };

  const handleRemovePlayer = (name: string) => {
    const updated = players.filter((p) => p !== name);
    setPlayers(updated);
    localStorage.setItem("mqp_players", JSON.stringify(updated));
    setErrorMsg("");
  };

  const triggerInputShake = () => {
    setIsInputShaking(false);
    if (shakeTimeoutRef.current !== null) {
      window.clearTimeout(shakeTimeoutRef.current);
    }
    requestAnimationFrame(() => setIsInputShaking(true));
    shakeTimeoutRef.current = window.setTimeout(() => setIsInputShaking(false), 400);
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
      triggerInputShake();
      playerInputRef.current?.focus();
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
            isTesting: true,
          });
        } catch (err) {
          console.error("Failed to prepare next rewarded ad:", err);
        }
      }
    }

    // Start game in either case
    await proceedToGame();
  };

  const handleUnlockExtraPlayers = async () => {
    const cap = (window as any).Capacitor;
    if (!cap?.Plugins?.AdMob) {
      setErrorMsg("Os vídeos recompensados estão disponíveis no aplicativo.");
      return;
    }

    setIsPlayerRewardLoading(true);
    const AdMob = cap.Plugins.AdMob;
    let rewardListener: { remove: () => Promise<void> } | null = null;
    let rewardConfirmed = false;

    try {
      const isAndroid = cap.getPlatform() === "android";
      const rewardedId = isAndroid
        ? "ca-app-pub-8691674404508428/2489517211"
        : "ca-app-pub-3940256099942544/1712485313";

      await AdMob.prepareRewardVideoAd({
        adId: rewardedId,
        isTesting: true,
      });

      if (typeof AdMob.addListener === "function") {
        rewardListener = await AdMob.addListener(
          "onRewardedVideoAdReward",
          () => {
            rewardConfirmed = true;
          }
        );
      }

      const rewardResult = await AdMob.showRewardVideoAd();
      if (rewardResult?.amount || rewardResult?.type) {
        rewardConfirmed = true;
      }

      if (!rewardConfirmed) {
        setErrorMsg("Assista ao vídeo até o fim para liberar mais jogadores.");
        return;
      }

      localStorage.setItem("cards_night_extra_players_v1", "true");
      setExtraPlayersUnlocked(true);
      setIsPlayerRewardModalOpen(false);
      setErrorMsg("Mais 6 vagas desbloqueadas!");
    } catch (error) {
      console.error("Failed to unlock extra player slots:", error);
      setErrorMsg("Não foi possível iniciar o vídeo. Tente novamente.");
    } finally {
      if (rewardListener) {
        await rewardListener.remove().catch(() => undefined);
      }
      setIsPlayerRewardLoading(false);

      try {
        const isAndroid = cap.getPlatform() === "android";
        const rewardedId = isAndroid
          ? "ca-app-pub-8691674404508428/2489517211"
          : "ca-app-pub-3940256099942544/1712485313";
        await AdMob.prepareRewardVideoAd({
          adId: rewardedId,
          isTesting: true,
        });
      } catch {
        // The next rewarded ad can be prepared when the app is used again.
      }
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
    <div className={styles.homeStage}>
      <main className={styles.homeMain}>
        <div className={styles.homeContent}>
          <header className={styles.homeHeader}>
            <Image
              src="/logo-cards-nigth-transparent.png"
              alt="Cards Night"
              width={340}
              height={340}
              priority
              className={styles.homeLogo}
            />
            <h1 className={styles.homeTitle}>
              <span className={styles.homeTitleCards}>CARDS</span>
              <span className={styles.homeTitleNight}>NIGHT</span>
            </h1>
            <p className={styles.homeSubtitle}>
              O jogo de cartas mais picante e divertido para animar sua noite. Contagens rápidas de 7 segundos e desafios intensos.
            </p>
          </header>

          <section className={styles.playerSection} aria-label="Jogadores">
            <form
              onSubmit={handleAddPlayer}
              className={`${styles.playerInputWrapper} ${isInputShaking ? styles.shakeFeedback : ""}`}
            >
              <input
                ref={playerInputRef}
                type="text"
                placeholder="Nome do jogador..."
                className={styles.playerInput}
                value={newPlayerName}
                onChange={(e) => setNewPlayerName(e.target.value)}
                maxLength={22}
                autoComplete="off"
                aria-label="Nome do jogador"
              />
              <button
                type="submit"
                className={styles.addPlayerButton}
                aria-label="Adicionar jogador"
                title="Adicionar jogador"
              >
                <Plus size={20} />
              </button>
            </form>

            <div className={styles.playersList}>
              {players.map((player) => (
                <div key={player} className={styles.playerChip}>
                  <span>{player}</span>
                  <button
                    type="button"
                    className={styles.removePlayerButton}
                    onClick={() => handleRemovePlayer(player)}
                    aria-label={`Remover ${player}`}
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>

            <div className={styles.minPlayersNotice} aria-live="polite">
              <span className={`${styles.statusDot} ${players.length >= 2 ? styles.statusReady : styles.statusWaiting}`} />
              <p className={players.length >= 2 ? styles.statusTextReady : styles.statusTextWaiting}>
                {players.length >= 2
                  ? `${players.length}/${extraPlayersUnlocked ? 12 : 6} jogadores prontos • ${extraPlayersUnlocked ? "Limite ampliado" : "Assista ao vídeo para adicionar até 12"}`
                  : players.length === 0
                    ? `Mínimo de 2 jogadores para iniciar • Até ${extraPlayersUnlocked ? 12 : 6}`
                    : `Adicione mais ${2 - players.length} jogador(es) para iniciar • Até ${extraPlayersUnlocked ? 12 : 6}`}
              </p>
            </div>

            <button
              className={`${styles.startGameButton} ${players.length < 2 ? styles.startGameLocked : ""}`}
              onClick={handleStartGame}
              disabled={loading}
            >
              <span>{loading ? "Carregando..." : "Iniciar Jogo"}</span>
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M8 5.14v14l11-7-11-7z" />
              </svg>
            </button>
          </section>
        </div>

        <footer className={styles.homeFooter}>
          <a
            href="https://cardsnigth.blogspot.com/#termos"
            target="_blank"
            rel="noopener noreferrer"
          >
            Termos de Uso
          </a>
          <span aria-hidden="true">•</span>
          <a
            href="https://cardsnigth.blogspot.com/#privacidade"
            target="_blank"
            rel="noopener noreferrer"
          >
            Política de Privacidade
          </a>
        </footer>
      </main>

      {errorMsg && (
        <div className={styles.toastBanner} role="alert">
          <span />
          <p>{errorMsg}</p>
        </div>
      )}

      {showLegalConsent && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="legal-consent-title"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 10000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
            background: "rgba(3, 5, 20, 0.82)",
            backdropFilter: "blur(8px)",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "420px",
              boxSizing: "border-box",
              padding: "24px",
              borderRadius: "18px",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              background: "#090E2B",
              textAlign: "center",
              boxShadow: "0 24px 80px rgba(0, 0, 0, 0.45)",
            }}
          >
            <h2
              id="legal-consent-title"
              style={{
                margin: "0 0 12px",
                fontFamily: "var(--font-home-jakarta), sans-serif",
                fontSize: "22px",
                lineHeight: 1.25,
              }}
            >
              Aceite os termos para continuar
            </h2>
            <p
              style={{
                margin: "0 0 20px",
                color: "rgba(255, 255, 255, 0.72)",
                fontFamily: "var(--font-home-jakarta), sans-serif",
                lineHeight: 1.55,
              }}
            >
              Para usar o aplicativo, leia e aceite a{" "}
              <a
                href="https://cardsnigth.blogspot.com/#privacidade"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#C9A6FF" }}
              >
                Política de Privacidade
              </a>{" "}
              e os{" "}
              <a
                href="https://cardsnigth.blogspot.com/#termos"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#C9A6FF" }}
              >
                Termos de Uso
              </a>.
            </p>
            <button
              type="button"
              className="btn-neon"
              onClick={acceptLegalTerms}
              style={{
                width: "100%",
                minHeight: "52px",
                justifyContent: "center",
                fontFamily: "var(--font-home-jakarta), sans-serif",
              }}
            >
              Aceitar termos
            </button>
          </div>
        </div>
      )}

      {isPlayerRewardModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="player-reward-title"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            background: "rgba(3, 2, 6, 0.9)",
            backdropFilter: "blur(12px)",
          }}
        >
          <div
            className="glass-container"
            style={{
              width: "100%",
              maxWidth: "420px",
              boxSizing: "border-box",
              padding: "30px",
              border: "1px solid rgba(138, 43, 226, 0.3)",
              borderRadius: "16px",
              background: "rgba(20, 10, 35, 0.92)",
              boxShadow: "0 0 30px rgba(138, 43, 226, 0.2)",
              textAlign: "center",
            }}
          >
            <h2
              id="player-reward-title"
              style={{
                margin: "0",
                color: "#fff",
                fontSize: "22px",
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
            >
              Mais 6 jogadores
            </h2>
            <p
              style={{
                margin: "16px 0 20px",
                color: "rgba(255, 255, 255, 0.7)",
                lineHeight: 1.6,
              }}
            >
              Você atingiu o limite de 6 jogadores. Assista ao vídeo recompensado até o fim para adicionar mais 6 e chegar ao limite de 12.
            </p>
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                type="button"
                className="btn-neon"
                disabled={isPlayerRewardLoading}
                style={{ flex: 1, minHeight: "52px", justifyContent: "center" }}
                onClick={handleUnlockExtraPlayers}
              >
                {isPlayerRewardLoading ? "Abrindo vídeo..." : "Assistir vídeo"}
              </button>
              <button
                type="button"
                disabled={isPlayerRewardLoading}
                style={{
                  flex: 1,
                  minHeight: "52px",
                  padding: "14px",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  borderRadius: "8px",
                  background: "transparent",
                  color: "rgba(255, 255, 255, 0.6)",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
                onClick={() => setIsPlayerRewardModalOpen(false)}
              >
                Voltar
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
