"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, BookOpen, Shield, EyeOff, ShieldCheck, Landmark, HelpCircle } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#f8fafc",
      color: "#334155",
      fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
      lineHeight: "1.7",
      padding: "40px 20px"
    }}>
      <div style={{
        maxWidth: "800px",
        margin: "0 auto",
        backgroundColor: "#ffffff",
        borderRadius: "16px",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
        padding: "40px",
        border: "1px solid #e2e8f0"
      }}>
        
        {/* Back Button */}
        <Link href="/" style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          color: "#7c3aed",
          textDecoration: "none",
          fontWeight: 600,
          fontSize: "14px",
          marginBottom: "30px",
          transition: "color 0.2s"
        }}>
          <ArrowLeft size={16} />
          Voltar para o Jogo
        </Link>

        {/* Title */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
          <Shield size={32} color="#7c3aed" />
          <h1 style={{ fontSize: "32px", fontWeight: 800, color: "#0f172a", margin: 0 }}>
            Política de Privacidade
          </h1>
        </div>
        <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "30px" }}>
          Última atualização: 1 de Agosto de 2026
        </p>

        {/* Introduction Box */}
        <div style={{
          backgroundColor: "#f8fafc",
          borderLeft: "4px solid #7c3aed",
          borderRadius: "8px",
          padding: "20px",
          marginBottom: "35px"
        }}>
          <p style={{ margin: 0, color: "#475569", fontSize: "14px", fontWeight: 500 }}>
            Nós do <strong>Ma Que P#&*! (Noite de Cartas)</strong> valorizamos e respeitamos a sua privacidade. Esta política detalha como lidamos com os seus dados, esclarecendo nosso compromisso em manter uma experiência de jogo offline segura e transparente para todos os participantes de faixa etária 18+.
          </p>
        </div>

        {/* Table of Contents (Index) */}
        <div style={{
          backgroundColor: "#f1f5f9",
          border: "1px solid #cbd5e1",
          borderRadius: "8px",
          padding: "24px",
          marginBottom: "40px"
        }}>
          <h3 style={{
            margin: "0 0 16px 0",
            color: "#0f172a",
            fontSize: "16px",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}>
            <BookOpen size={18} color="#7c3aed" />
            Índice de Conteúdo
          </h3>
          <ul style={{ margin: 0, paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "10px", fontSize: "15px" }}>
            <li>
              <a href="#dados-locais" style={{ color: "#7c3aed", textDecoration: "none", fontWeight: 600 }}>
                1. Armazenamento Totalmente Local (Offline)
              </a>
            </li>
            <li>
              <a href="#anuncios" style={{ color: "#7c3aed", textDecoration: "none", fontWeight: 600 }}>
                2. Rede de Anúncios e Dados de Terceiros (Google AdMob)
              </a>
            </li>
            <li>
              <a href="#compartilhamento" style={{ color: "#7c3aed", textDecoration: "none", fontWeight: 600 }}>
                3. Sem Compartilhamento de Informações Pessoais
              </a>
            </li>
            <li>
              <a href="#idade" style={{ color: "#7c3aed", textDecoration: "none", fontWeight: 600 }}>
                4. Classificação Indicativa (Uso Exclusivo 18+)
              </a>
            </li>
            <li>
              <a href="#seguranca" style={{ color: "#7c3aed", textDecoration: "none", fontWeight: 600 }}>
                5. Segurança de Dados no Dispositivo
              </a>
            </li>
            <li>
              <a href="#direitos" style={{ color: "#7c3aed", textDecoration: "none", fontWeight: 600 }}>
                6. Seus Direitos (LGPD e Legislação Local)
              </a>
            </li>
            <li>
              <a href="#duvidas" style={{ color: "#7c3aed", textDecoration: "none", fontWeight: 600 }}>
                7. Dúvidas e Contato
              </a>
            </li>
          </ul>
        </div>

        {/* Sections */}
        <div style={{ display: "flex", flexDirection: "column", gap: "35px" }}>
          
          {/* Section 1 */}
          <section id="dados-locais">
            <h2 style={{ fontSize: "20px", color: "#0f172a", fontWeight: 800, marginTop: 0, marginBottom: "12px", borderBottom: "1px solid #e2e8f0", paddingBottom: "8px" }}>
              1. Armazenamento Totalmente Local (Offline)
            </h2>
            <div style={{ display: "flex", gap: "12px", marginBottom: "12px" }}>
              <EyeOff size={20} color="#7c3aed" style={{ flexShrink: 0, marginTop: "3px" }} />
              <p style={{ margin: 0 }}>
                O aplicativo <strong>Ma Que P#&*! (Noite de Cartas)</strong> não possui servidores de banco de dados para cadastro ou rastreamento de perfis de usuários. Todos os dados que você insere no aplicativo (como os nomes dos jogadores cadastrados para a partida) são salvos de forma estritamente local no armazenamento do navegador ou dispositivo do próprio usuário (`localStorage`).
              </p>
            </div>
            <p style={{ margin: 0 }}>
              Isso significa que nenhuma informação inserida por você para jogar é enviada aos desenvolvedores ou transmitida para servidores terceiros de armazenamento. O jogo funciona essencialmente offline quanto à lógica do tabuleiro e cartas.
            </p>
          </section>

          {/* Section 2 */}
          <section id="anuncios">
            <h2 style={{ fontSize: "20px", color: "#0f172a", fontWeight: 800, marginTop: 0, marginBottom: "12px", borderBottom: "1px solid #e2e8f0", paddingBottom: "8px" }}>
              2. Rede de Anúncios e Dados de Terceiros (Google AdMob)
            </h2>
            <p style={{ marginBottom: "12px" }}>
              Para manter o aplicativo totalmente gratuito e viabilizar os custos de desenvolvimento, integramos a biblioteca de monetização do <strong>Google AdMob</strong>.
            </p>
            <p style={{ marginBottom: "12px" }}>
              A Google pode coletar e processar determinados dados com a finalidade de servir anúncios (como banners, intersticiais e vídeos premiados), incluindo:
            </p>
            <ul style={{ margin: "0 0 12px 0", paddingLeft: "20px" }}>
              <li>Identificadores de publicidade móvel exclusivos do dispositivo (como o IDFA do iOS ou o GAID do Android);</li>
              <li>Dados de eventos de interação com os anúncios (cliques, visualizações de vídeos premiados);</li>
              <li>Informações técnicas gerais sobre o sistema operacional, modelo do dispositivo e localização geográfica aproximada (baseada no IP).</li>
            </ul>
            <p style={{ margin: 0 }}>
              Você pode desativar a personalização de anúncios nas configurações do sistema do seu celular (nas opções de privacidade e anúncios do Android ou iOS).
            </p>
          </section>

          {/* Section 3 */}
          <section id="compartilhamento">
            <h2 style={{ fontSize: "20px", color: "#0f172a", fontWeight: 800, marginTop: 0, marginBottom: "12px", borderBottom: "1px solid #e2e8f0", paddingBottom: "8px" }}>
              3. Sem Compartilhamento de Informações Pessoais
            </h2>
            <p style={{ margin: 0 }}>
              Nós não vendemos, alugamos ou compartilhamos dados pessoais dos usuários. Como os dados das partidas residem apenas em seu próprio aparelho e não possuímos sistemas na nuvem de rastreamento de contatos, seu histórico de partidas e nomes de amigos são completamente privados e restritos ao dispositivo físico usado para jogar.
            </p>
          </section>

          {/* Section 4 */}
          <section id="idade">
            <h2 style={{ fontSize: "20px", color: "#0f172a", fontWeight: 800, marginTop: 0, marginBottom: "12px", borderBottom: "1px solid #e2e8f0", paddingBottom: "8px" }}>
              4. Classificação Indicativa (Uso Exclusivo 18+)
            </h2>
            <p style={{ margin: 0 }}>
              Tendo em vista o teor das piadas, questionamentos íntimos e dinâmicas contidas em nossas cartas, <strong>o jogo é direcionado e utilizável exclusivamente por pessoas com mais de 18 anos de idade</strong>. Nós não coletamos intencionalmente dados de crianças ou adolescentes menores de 18 anos. Se tomarmos conhecimento de que um menor de idade está usando o app de forma indevida, orientamos os pais ou responsáveis a cessarem imediatamente o acesso.
            </p>
          </section>

          {/* Section 5 */}
          <section id="seguranca">
            <h2 style={{ fontSize: "20px", color: "#0f172a", fontWeight: 800, marginTop: 0, marginBottom: "12px", borderBottom: "1px solid #e2e8f0", paddingBottom: "8px" }}>
              5. Segurança de Dados no Dispositivo
            </h2>
            <p style={{ margin: 0 }}>
              Por utilizarmos o armazenamento local (`localStorage`), a segurança física e de acesso do celular é de responsabilidade do próprio dono do aparelho. Recomendamos que você mantenha seu sistema operacional atualizado e com mecanismos adequados de proteção contra vírus, malware e acessos físicos não autorizados de terceiros.
            </p>
          </section>

          {/* Section 6 */}
          <section id="direitos">
            <h2 style={{ fontSize: "20px", color: "#0f172a", fontWeight: 800, marginTop: 0, marginBottom: "12px", borderBottom: "1px solid #e2e8f0", paddingBottom: "8px" }}>
              6. Seus Direitos (LGPD e Legislação Local)
            </h2>
            <p style={{ marginBottom: "12px" }}>
              Sob a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018), você possui plenos direitos sobre as informações em seu dispositivo.
            </p>
            <div style={{ display: "flex", gap: "12px", marginBottom: "12px" }}>
              <ShieldCheck size={20} color="#7c3aed" style={{ flexShrink: 0, marginTop: "3px" }} />
              <p style={{ margin: 0 }}>
                <strong>Controle total:</strong> Você pode excluir todos os nomes de jogadores e registros salvos a qualquer momento simplesmente limpando os dados de cache do aplicativo nas configurações do seu celular ou desinstalando-o. Como não guardamos seus dados na nuvem, você detém o controle físico integral da exclusão das suas informações.
              </p>
            </div>
          </section>

          {/* Section 7 */}
          <section id="duvidas">
            <h2 style={{ fontSize: "20px", color: "#0f172a", fontWeight: 800, marginTop: 0, marginBottom: "12px", borderBottom: "1px solid #e2e8f0", paddingBottom: "8px" }}>
              7. Dúvidas e Contato
            </h2>
            <div style={{ display: "flex", gap: "12px" }}>
              <HelpCircle size={20} color="#7c3aed" style={{ flexShrink: 0, marginTop: "3px" }} />
              <p style={{ margin: 0 }}>
                Se você tiver perguntas sobre esta Política de Privacidade ou precisar de esclarecimentos sobre o tratamento offline dos seus dados ou a rede AdMob, por favor, entre em contato através da página de suporte na Google Play Store.
              </p>
            </div>
          </section>

        </div>

      </div>
    </div>
  );
}
