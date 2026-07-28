"use client";

import React, { useState, useEffect, useRef } from "react";
import SwiperCore from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCards } from "swiper/modules";
import { Flame, Play, Check, X, Award, RotateCcw, Home, Volume2, VolumeX, ShieldAlert } from "lucide-react";
import GameCard from "./GameCard";
import { getRandomCards } from "../../app/actions";

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-cards";

interface GameEngineProps {
  initialCards: Array<{ id: string; content: string }>;
  players: string[];
  onBackToMenu: () => void;
}

export default function GameEngine({ initialCards, players, onBackToMenu }: GameEngineProps) {
  const [mounted, setMounted] = useState(false);
  const [cards, setCards] = useState(initialCards);
  const [activeIdx, setActiveIdx] = useState(0);
  const [flippedCards, setFlippedCards] = useState<Record<number, boolean>>({});
  
  // Timer States
  const [countdown, setCountdown] = useState(7);
  const [isCounting, setIsCounting] = useState(false);
  const [countdownFinished, setCountdownFinished] = useState(false);
  
  // Scoreboard
  const [scores, setScores] = useState<Record<string, number>>(
    players.reduce((acc, player) => ({ ...acc, [player]: 0 }), {})
  );
  
  const swiperRef = useRef<SwiperCore | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Sounds (synthesized with Web Audio API to avoid external asset requirements!)
  const playSound = (type: "tick" | "success" | "fail" | "start") => {
    if (isMuted || typeof window === "undefined") return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === "tick") {
        osc.frequency.setValueAtTime(600, ctx.currentTime);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        osc.start();
        osc.stop(ctx.currentTime + 0.1);
      } else if (type === "start") {
        osc.type = "triangle";
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      } else if (type === "success") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
        osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2); // G5
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
      } else if (type === "fail") {
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(220, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(110, ctx.currentTime + 0.4);
        gain.gain.setValueAtTime(0.25, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
      }
    } catch (e) {
      console.warn("Audio Context error:", e);
    }
  };

  useEffect(() => {
    setMounted(true);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Imperatively control Swiper touch movement permission to avoid React 19 re-render loops
  useEffect(() => {
    if (swiperRef.current) {
      if (countdownFinished) {
        swiperRef.current.enableTouchMove();
      } else {
        swiperRef.current.disableTouchMove();
      }
    }
  }, [countdownFinished]);

  if (!mounted) return null;

  const currentPlayer = players[activeIdx % players.length] || "Jogador";

  const handleCardFlip = (index: number) => {
    // Only flip if it's the active card
    if (index !== activeIdx) return;
    
    setFlippedCards(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const startTimer = () => {
    if (isCounting) return;
    setIsCounting(true);
    setCountdown(7);
    playSound("start");

    timerRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          setIsCounting(false);
          setCountdownFinished(true);
          playSound("success");
          return 0;
        }
        playSound("tick");
        return prev - 1;
      });
    }, 1000);
  };

  const handleChoice = (accepted: boolean) => {
    // Update score
    if (accepted) {
      setScores(prev => ({
        ...prev,
        [currentPlayer]: (prev[currentPlayer] || 0) + 1
      }));
      playSound("success");
    } else {
      playSound("fail");
    }

    // Move to next card or trigger game over
    if (activeIdx >= 29 || activeIdx >= cards.length - 1) {
      // Game finished after 30 cards
      setTimeout(() => {
        setGameOver(true);
      }, 500);
    } else {
      // Slide to next card
      if (swiperRef.current) {
        // Temporarily allow move to slide next
        swiperRef.current.enableTouchMove();
        swiperRef.current.slideNext();
      }
    }
  };

  const handleSlideChange = (s: SwiperCore) => {
    const newIndex = s.activeIndex;
    
    setActiveIdx(prevIdx => {
      if (prevIdx === newIndex) return prevIdx;
      
      // Clear any running timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      // Reset state for new card
      setIsCounting(false);
      setCountdownFinished(false);
      setCountdown(7);
      
      return newIndex;
    });
  };

  const handleRestart = async () => {
    // Fetch 30 new cards
    const newCards = await getRandomCards(30);
    setCards(newCards);
    setActiveIdx(0);
    setFlippedCards({});
    setCountdown(7);
    setIsCounting(false);
    setCountdownFinished(false);
    setScores(players.reduce((acc, player) => ({ ...acc, [player]: 0 }), {}));
    setGameOver(false);
    if (swiperRef.current) {
      swiperRef.current.slideTo(0, 0);
    }
  };

  if (gameOver) {
    // Sort players by score
    const sortedRanking = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    const maxScore = sortedRanking[0]?.[1] ?? 0;
    const winners = sortedRanking.filter(p => p[1] === maxScore).map(p => p[0]);

    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "20px", background: "linear-gradient(to bottom, #070312, #020105)" }}>
        <div className="glass-container" style={{ width: "100%", maxWidth: "480px", textAlign: "center", display: "flex", flexDirection: "column", gap: "24px" }}>
          
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
            <div style={{ background: "rgba(255, 215, 0, 0.15)", borderRadius: "50%", padding: "16px", border: "1px solid rgba(255, 215, 0, 0.4)", animation: "float 3s ease-in-out infinite" }}>
              <Award size={64} color="#ffd700" style={{ filter: "drop-shadow(0 0 10px #ffd700)" }} />
            </div>
            <h1 style={{ fontFamily: "var(--font-title)", fontSize: "32px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "1px", background: "linear-gradient(to right, #ffd700, #ff8c00)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Fim de Jogo!
            </h1>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "14px" }}>
              30 cartas foram respondidas. Eis os vencedores:
            </p>
          </div>

          <div style={{ background: "rgba(255, 255, 255, 0.03)", borderRadius: "16px", padding: "16px", border: "1px solid rgba(255,255,255,0.05)" }}>
            <h3 style={{ textTransform: "uppercase", color: "#ffd700", letterSpacing: "2px", fontSize: "16px", marginBottom: "15px", fontFamily: "var(--font-title)" }}>
              🏆 Vencedor(es) 🏆
            </h3>
            <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "10px", fontSize: "24px", fontWeight: 700, color: "#fff" }}>
              {winners.join(" & ")}
            </div>
            <div style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)", marginTop: "5px" }}>
              Com {maxScore} ponto(s) aceito(s)
            </div>
          </div>

          <div style={{ textAlign: "left" }}>
            <h4 style={{ textTransform: "uppercase", color: "rgba(255,255,255,0.4)", fontSize: "12px", letterSpacing: "1px", marginBottom: "10px" }}>
              Classificação Geral
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {sortedRanking.map(([player, score], i) => (
                <div key={player} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", borderRadius: "10px", background: i === 0 ? "rgba(255, 215, 0, 0.08)" : "rgba(255, 255, 255, 0.02)", border: i === 0 ? "1px solid rgba(255, 215, 0, 0.2)" : "1px solid rgba(255,255,255,0.05)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ fontSize: "16px", fontWeight: 700, color: i === 0 ? "#ffd700" : "rgba(255,255,255,0.4)" }}>
                      #{i + 1}
                    </span>
                    <span style={{ fontWeight: 600 }}>{player}</span>
                  </div>
                  <span style={{ fontWeight: 700, color: i === 0 ? "#ffd700" : "#ff007f" }}>
                    {score} pts
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", gap: "12px", width: "100%", marginTop: "10px" }}>
            <button className="btn-neon" style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", gap: "8px" }} onClick={handleRestart}>
              <RotateCcw size={18} /> Rejogar
            </button>
            <button className="btn-neon btn-neon-pink" style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", gap: "8px" }} onClick={onBackToMenu}>
              <Home size={18} /> Menu
            </button>
          </div>

        </div>
      </div>
    );
  }

  const isCurrentFlipped = !!flippedCards[activeIdx];

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "radial-gradient(circle at center, #0f0822 0%, #030206 100%)", paddingBottom: "30px" }}>
      
      {/* HEADER NAVBAR */}
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 24px", borderBottom: "1px solid rgba(138, 43, 226, 0.15)", background: "rgba(3, 2, 6, 0.8)", backdropFilter: "blur(8px)", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }} onClick={onBackToMenu}>
          <Flame size={24} color="#ff007f" style={{ filter: "drop-shadow(0 0 5px #ff007f)", cursor: "pointer" }} />
          <span style={{ fontFamily: "var(--font-title)", fontWeight: 800, fontSize: "18px", letterSpacing: "1px", cursor: "pointer" }}>
            MQP
          </span>
        </div>
        
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ fontSize: "14px", background: "rgba(255, 0, 127, 0.1)", border: "1px solid rgba(255, 0, 127, 0.3)", padding: "4px 12px", borderRadius: "20px", fontWeight: 700, color: "#ff007f" }}>
            Carta {activeIdx + 1} / 30
          </div>
          
          <button style={{ background: "transparent", border: "none", color: "rgba(255,255,255,0.6)", cursor: "pointer", display: "flex", alignItems: "center" }} onClick={() => setIsMuted(!isMuted)}>
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
        </div>
      </header>

      {/* GAME CONTENT CONTAINER */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "20px 10px", gap: "20px" }}>
        
        {/* CURRENT TURN CARD HEADER */}
        <div style={{ textAlign: "center", marginBottom: "5px" }}>
          <p style={{ textTransform: "uppercase", fontSize: "12px", letterSpacing: "2px", color: "rgba(255,255,255,0.5)", marginBottom: "4px" }}>
            Desafio para:
          </p>
          <h2 style={{ fontFamily: "var(--font-title)", fontSize: "28px", fontWeight: 800, color: "#fff", textShadow: "0 0 10px rgba(255,0,127,0.5)" }}>
            {currentPlayer}
          </h2>
        </div>

        {/* SWIPER CARD DECK */}
        <div style={{ position: "relative" }}>
          <Swiper
            effect="cards"
            modules={[EffectCards]}
            className="swiper"
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
              swiper.disableTouchMove();
            }}
            onSlideChange={handleSlideChange}
          >
            {cards.map((card, i) => (
              <SwiperSlide key={card.id}>
                <GameCard
                  content={card.content}
                  player={players[i % players.length] || "Jogador"}
                  isFlipped={!!flippedCards[i]}
                  onFlip={() => handleCardFlip(i)}
                  index={i}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* GAME CONTROLS */}
        <div style={{ minHeight: "120px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", width: "100%", maxWidth: "340px", gap: "15px" }}>
          
          {/* STEP 1: CARD IS FACEDOWN */}
          {!isCurrentFlipped && (
            <div style={{ textAlign: "center", color: "rgba(255,255,255,0.4)", fontSize: "14px", display: "flex", alignItems: "center", gap: "8px" }}>
              <ShieldAlert size={16} /> Toque na carta acima para revelá-la.
            </div>
          )}

          {/* STEP 2: CARD IS FLIPPED, WAITING FOR TIMER */}
          {isCurrentFlipped && !isCounting && !countdownFinished && (
            <button className="btn-neon" style={{ display: "flex", alignItems: "center", gap: "10px", width: "100%", justifyContent: "center" }} onClick={startTimer}>
              <Play size={18} /> Iniciar Contagem (7s)
            </button>
          )}

          {/* STEP 3: TIMER RUNNING */}
          {isCounting && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", width: "100%" }}>
              {/* Outer visual progress bar */}
              <div style={{ width: "100%", height: "8px", background: "rgba(255,255,255,0.05)", borderRadius: "4px", overflow: "hidden", border: "1px solid rgba(138,43,226,0.2)" }}>
                <div style={{ height: "100%", background: "linear-gradient(to right, #8a2be2, #ff007f)", width: `${(countdown / 7) * 100}%`, transition: "width 1s linear" }} />
              </div>
              <div style={{ fontFamily: "var(--font-title)", fontSize: "36px", fontWeight: 800, color: "#fff", textShadow: "0 0 10px var(--color-pink)" }}>
                {countdown}s
              </div>
            </div>
          )}

          {/* STEP 4: TIMER COMPLETED -> ACTION BUTTONS OR SWIPE INFO */}
          {countdownFinished && (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", width: "100%" }}>
              <div style={{ display: "flex", gap: "16px", width: "100%" }}>
                <button
                  className="btn-neon btn-neon-pink"
                  style={{ flex: 1, borderColor: varColors("red"), display: "flex", justifyContent: "center", alignItems: "center", gap: "8px" }}
                  onClick={() => handleChoice(false)}
                >
                  <X size={20} /> Negar
                </button>
                <button
                  className="btn-neon"
                  style={{ flex: 1, borderColor: varColors("green"), display: "flex", justifyContent: "center", alignItems: "center", gap: "8px" }}
                  onClick={() => handleChoice(true)}
                >
                  <Check size={20} /> Aceitar
                </button>
              </div>
              
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "11px", textAlign: "center", letterSpacing: "0.5px" }}>
                Você também pode arrastar a carta para os lados para avançar!
              </p>
            </div>
          )}

        </div>

      </main>
    </div>
  );
}

// Utility to inject colors into styled attributes safely
function varColors(type: "green" | "red") {
  if (type === "green") return "#39ff14";
  return "#ff3333";
}
