"use client";

import { Flame, Plus, ShieldAlert, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
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
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);

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
              <button
                type="button"
                onClick={() => setIsTermsModalOpen(true)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#ff007f",
                  textDecoration: "underline",
                  cursor: "pointer",
                  fontWeight: 600,
                  padding: 0,
                  fontSize: "14px"
                }}
              >
                Termos de Uso e Política de Privacidade
              </button>.
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

      {/* TERMS OF USE & PRIVACY POLICY OVERLAY (LIGHT THEME) */}
      {isTermsModalOpen && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100dvh",
          backgroundColor: "#ffffff",
          zIndex: 10000,
          display: "flex",
          flexDirection: "column",
          color: "#2d2d2d",
          fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
        }}>
          {/* Header */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "16px 24px",
            borderBottom: "1px solid #e2e8f0",
            backgroundColor: "#f8fafc"
          }}>
            <h2 style={{ margin: 0, fontSize: "18px", fontWeight: 800, color: "#110729", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Termos e Políticas
            </h2>
            <button
              onClick={() => setIsTermsModalOpen(false)}
              style={{
                padding: "8px 18px",
                backgroundColor: "#110729",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: 700,
                fontSize: "14px",
                transition: "opacity 0.2s"
              }}
            >
              Fechar
            </button>
          </div>

          {/* Scrollable Content */}
          <div style={{
            flex: 1,
            overflowY: "auto",
            padding: "24px 20px",
            maxWidth: "720px",
            margin: "0 auto",
            lineHeight: "1.7",
            fontSize: "15px",
            scrollBehavior: "smooth"
          }}>
            <h1 style={{ fontSize: "28px", color: "#110729", marginBottom: "6px", fontWeight: 800 }}>
              Termos de Uso e Política de Privacidade
            </h1>
            <p style={{ color: "#64748b", fontSize: "13px", marginBottom: "24px" }}>
              Última atualização: 1 de Agosto de 2026
            </p>

            <p style={{ margin: "0 0 16px 0" }}>
              Bem-vindo ao aplicativo <strong>Ma Que P#&*! (Noite de Cartas)</strong>. Este documento define as regras de uso do nosso aplicativo e o tratamento das suas informações. Leia-o integralmente antes de começar a jogar.
            </p>

            {/* Index */}
            <div style={{
              backgroundColor: "#f1f5f9",
              border: "1px solid #cbd5e1",
              borderRadius: "8px",
              padding: "16px 20px",
              margin: "24px 0"
            }}>
              <h3 style={{ margin: "0 0 10px 0", color: "#110729", fontSize: "15px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Índice
              </h3>
              <ul style={{ margin: 0, paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "8px", fontSize: "14px" }}>
                <li>
                  <a href="#intro" style={{ color: "#ff007f", textDecoration: "none", fontWeight: 600 }}>
                    1. Introdução ao Aplicativo
                  </a>
                </li>
                <li>
                  <a href="#idade" style={{ color: "#ff007f", textDecoration: "none", fontWeight: 600 }}>
                    2. Restrição de Idade e Responsabilidade
                  </a>
                </li>
                <li>
                  <a href="#bebidas" style={{ color: "#ff007f", textDecoration: "none", fontWeight: 600 }}>
                    3. Consumo de Bebidas Alcoólicas
                  </a>
                </li>
                <li>
                  <a href="#conteudo" style={{ color: "#ff007f", textDecoration: "none", fontWeight: 600 }}>
                    4. Uso Aceitável do Conteúdo
                  </a>
                </li>
                <li>
                  <a href="#limitacao" style={{ color: "#ff007f", textDecoration: "none", fontWeight: 600 }}>
                    5. Limitação de Responsabilidade
                  </a>
                </li>
                <li>
                  <a href="#privacidade" style={{ color: "#ff007f", textDecoration: "none", fontWeight: 600 }}>
                    6. Política de Privacidade e Dados
                  </a>
                </li>
                <li>
                  <a href="#contato" style={{ color: "#ff007f", textDecoration: "none", fontWeight: 600 }}>
                    7. Alterações e Contato
                  </a>
                </li>
              </ul>
            </div>

            <hr style={{ border: 0, borderTop: "1px solid #e2e8f0", margin: "24px 0" }} />

            {/* Sections */}
            <h2 id="intro" style={{ color: "#110729", fontSize: "18px", fontWeight: 800, marginTop: "24px", marginBottom: "10px" }}>
              1. Introdução ao Aplicativo
            </h2>
            <p style={{ margin: "0 0 16px 0" }}>
              O <strong>Ma Que P#&*! (Noite de Cartas)</strong> é um jogo social recreativo offline que oferece cartas com perguntas, desafios humorísticos e dinâmicas interativas. O uso deste software é totalmente voluntário e visa apenas o entretenimento entre amigos.
            </p>

            <h2 id="idade" style={{ color: "#110729", fontSize: "18px", fontWeight: 800, marginTop: "24px", marginBottom: "10px" }}>
              2. Restrição de Idade e Responsabilidade
            </h2>
            <p style={{ margin: "0 0 16px 0" }}>
              Considerando a natureza e teor das perguntas e desafios contidos nas cartas (que podem envolver temas de teor adulto, piadas de duplo sentido e dinâmicas de revelação íntima), o uso deste aplicativo é <strong>restrito e exclusivo para pessoas com idade igual ou superior a 18 anos</strong>. Ao clicar em aceitar, o usuário declara sob as penas da lei ter a idade mínima exigida.
            </p>

            <h2 id="bebidas" style={{ color: "#110729", fontSize: "18px", fontWeight: 800, marginTop: "24px", marginBottom: "10px" }}>
              3. Consumo de Bebidas Alcoólicas e Substâncias
            </h2>
            <p style={{ margin: "0 0 16px 0" }}>
              O aplicativo <strong>não estimula, obriga ou incentiva o consumo de bebidas alcoólicas</strong>, substâncias ilícitas ou comportamentos de risco. Caso os participantes escolham jogar associando as cartas a doses de bebidas, declaram fazê-lo conscientemente, responsabilizando-se inteiramente por sua saúde física e segurança. Os desenvolvedores do app eximem-se de qualquer consequência direta ou indireta gerada por tal conduta.
            </p>

            <h2 id="conteudo" style={{ color: "#110729", fontSize: "18px", fontWeight: 800, marginTop: "24px", marginBottom: "10px" }}>
              4. Uso Aceitável do Conteúdo
            </h2>
            <p style={{ margin: "0 0 16px 0" }}>
              Os usuários concordam em interagir de forma consensual e respeitosa. Nenhum participante deve ser coagido a realizar desafios ou responder a perguntas que violem seus valores éticos, morais ou que causem qualquer desconforto físico ou psicológico.
            </p>

            <h2 id="limitacao" style={{ color: "#110729", fontSize: "18px", fontWeight: 800, marginTop: "24px", marginBottom: "10px" }}>
              5. Limitação de Responsabilidade
            </h2>
            <p style={{ margin: "0 0 16px 0" }}>
              Os criadores deste aplicativo não serão responsabilizados perante o usuário ou terceiros por qualquer dano moral, físico, perda de dados ou incidentes decorrentes de condutas abusivas adotadas durante a utilização do jogo. O app é fornecido sem garantias implícitas ou explícitas de qualquer natureza.
            </p>

            <h2 id="privacidade" style={{ color: "#110729", fontSize: "18px", fontWeight: 800, marginTop: "24px", marginBottom: "10px" }}>
              6. Política de Privacidade e Dados
            </h2>
            <p style={{ margin: "0 0 16px 0" }}>
              Nós prezamos pelo direito à privacidade e privacidade dos dados dos usuários:
            </p>
            <ul style={{ margin: "0 0 16px 0", paddingLeft: "20px" }}>
              <li><strong>Sem Servidores de Cadastro:</strong> Não coletamos nem armazenamos os nomes digitados no aplicativo. Os nomes dos jogadores são salvos localmente na memória interna do navegador (`localStorage`) para fins de conveniência de uso e não são transmitidos a nenhum servidor externo.</li>
              <li><strong>Anúncios Móveis (Google AdMob):</strong> O aplicativo utiliza a biblioteca da Google AdMob para servir anúncios. Para fins de otimização de publicidade, a Google pode ler identificadores de publicidade móvel exclusivos e informações do sistema operacional.</li>
            </ul>

            <h2 id="contato" style={{ color: "#110729", fontSize: "18px", fontWeight: 800, marginTop: "24px", marginBottom: "10px" }}>
              7. Alterações e Contato
            </h2>
            <p style={{ margin: "0 0 16px 0" }}>
              Este termo poderá ser alterado a qualquer momento para se adequar a novas funcionalidades ou requisitos legais. O uso continuado após alterações implica aceitação automática dos termos revisados.
            </p>

            {/* Extra spacing for smooth anchor scrolling */}
            <div style={{ height: "100px" }}></div>
          </div>
        </div>
      )}
    </div>
  );
}
