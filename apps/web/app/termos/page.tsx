"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, BookOpen, Scale, AlertOctagon, HeartHandshake, ShieldAlert } from "lucide-react";

export default function TermsOfUse() {
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
          <Scale size={32} color="#7c3aed" />
          <h1 style={{ fontSize: "32px", fontWeight: 800, color: "#0f172a", margin: 0 }}>
            Termos de Uso
          </h1>
        </div>
        <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "30px" }}>
          Última atualização: 1 de Agosto de 2026
        </p>

        {/* Alert Box: 18+ Warning & No Liability */}
        <div style={{
          backgroundColor: "#fff1f2",
          borderLeft: "4px solid #f43f5e",
          borderRadius: "8px",
          padding: "20px",
          marginBottom: "35px",
          display: "flex",
          gap: "16px"
        }}>
          <ShieldAlert size={24} color="#f43f5e" style={{ flexShrink: 0, marginTop: "2px" }} />
          <div>
            <h4 style={{ margin: "0 0 6px 0", color: "#9f1239", fontSize: "16px", fontWeight: 700 }}>
              AVISO IMPORTANTE: Classificação 18+ e Limitação de Responsabilidade
            </h4>
            <p style={{ margin: 0, color: "#be123c", fontSize: "14px", fontWeight: 500 }}>
              Este aplicativo é direcionado <strong>exclusivamente para maiores de 18 anos</strong>. O conteúdo das cartas e desafios envolve temas adultos, íntimos e humorísticos. Os desenvolvedores e criadores <strong>não se responsabilizam</strong> por quaisquer ações, condutas, incidentes, danos físicos, morais ou de qualquer outra natureza decorrentes do uso desta aplicação.
            </p>
          </div>
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
              <a href="#introducao" style={{ color: "#7c3aed", textDecoration: "none", fontWeight: 600 }}>
                1. Introdução ao Aplicativo
              </a>
            </li>
            <li>
              <a href="#elegibilidade" style={{ color: "#7c3aed", textDecoration: "none", fontWeight: 600 }}>
                2. Restrição de Idade e Elegibilidade (18+)
              </a>
            </li>
            <li>
              <a href="#isencao" style={{ color: "#7c3aed", textDecoration: "none", fontWeight: 600 }}>
                3. Isenção Geral de Responsabilidade
              </a>
            </li>
            <li>
              <a href="#bebidas" style={{ color: "#7c3aed", textDecoration: "none", fontWeight: 600 }}>
                4. Consumo Voluntário de Álcool e Substâncias
              </a>
            </li>
            <li>
              <a href="#regras" style={{ color: "#7c3aed", textDecoration: "none", fontWeight: 600 }}>
                5. Regras de Conduta e Consentimento mútuo
              </a>
            </li>
            <li>
              <a href="#licenca" style={{ color: "#7c3aed", textDecoration: "none", fontWeight: 600 }}>
                6. Licença de Uso e Limitação Técnica
              </a>
            </li>
            <li>
              <a href="#modificacoes" style={{ color: "#7c3aed", textDecoration: "none", fontWeight: 600 }}>
                7. Modificações nos Termos e Contato
              </a>
            </li>
          </ul>
        </div>

        {/* Sections */}
        <div style={{ display: "flex", flexDirection: "column", gap: "35px" }}>
          
          {/* Section 1 */}
          <section id="introducao">
            <h2 style={{ fontSize: "20px", color: "#0f172a", fontWeight: 800, marginTop: 0, marginBottom: "12px", borderBottom: "1px solid #e2e8f0", paddingBottom: "8px" }}>
              1. Introdução ao Aplicativo
            </h2>
            <p style={{ margin: 0 }}>
              O aplicativo <strong>Ma Que P#&*! (Noite de Cartas)</strong> é um jogo social recreativo projetado para funcionar localmente e offline. Ele disponibiliza cartas virtuais contendo perguntas de resposta rápida (desafios de 7 segundos), dinâmicas interativas e propostas descontraídas para animar encontros sociais e festas. Ao abrir, acessar ou usar o aplicativo, você concorda formalmente em cumprir todas as regras contidas neste documento.
            </p>
          </section>

          {/* Section 2 */}
          <section id="elegibilidade">
            <h2 style={{ fontSize: "20px", color: "#0f172a", fontWeight: 800, marginTop: 0, marginBottom: "12px", borderBottom: "1px solid #e2e8f0", paddingBottom: "8px" }}>
              2. Restrição de Idade e Elegibilidade (18+)
            </h2>
            <p style={{ marginBottom: "12px" }}>
              Devido à natureza dos temas abordados pelas cartas — que incluem brincadeiras de cunho adulto, insinuações, confissões íntimas e piadas de duplo sentido —, o uso desta ferramenta é <strong>estritamente restrito a indivíduos com idade mínima de 18 anos</strong> (ou a idade de maioridade legal na sua jurisdição).
            </p>
            <p style={{ margin: 0 }}>
              Se você tem menos de 18 anos, deve desinstalar e fechar o aplicativo imediatamente. Ao continuar, declarar-se maior de idade e utilizar o sistema, você garante sob as penas da lei e civilmente que atende a esta exigência de elegibilidade.
            </p>
          </section>

          {/* Section 3 */}
          <section id="isencao">
            <h2 style={{ fontSize: "20px", color: "#0f172a", fontWeight: 800, marginTop: 0, marginBottom: "12px", borderBottom: "1px solid #e2e8f0", paddingBottom: "8px" }}>
              3. Isenção Geral de Responsabilidade
            </h2>
            <p style={{ marginBottom: "12px" }}>
              O aplicativo é fornecido &quot;como está&quot; e &quot;conforme disponível&quot;, sem quaisquer garantias implícitas ou explícitas de funcionamento ideal ou adequação.
            </p>
            <p style={{ marginBottom: "12px", fontWeight: 600, color: "#0f172a" }}>
              OS DESENVOLVEDORES, DESIGNERS E DISTRIBUIDORES DO APLICATIVO EXIMEM-SE DE QUALQUER RESPONSABILIDADE CIVIL OU PENAL POR DANOS DIRETOS, INDIRETOS, MORAIS, FÍSICOS, PSICOLÓGICOS OU SOCIAIS RESULTANTES DE:
            </p>
            <ul style={{ margin: "0 0 12px 0", paddingLeft: "20px" }}>
              <li>Interações indesejadas, brigas ou desentendimentos ocorridos entre os participantes do jogo;</li>
              <li>Ações físicas tomadas por usuários para cumprir ou tentar cumprir os desafios descritos nas cartas;</li>
              <li>Sentimentos de desconforto, constrangimento ou estresse mental decorrentes das perguntas íntimas;</li>
              <li>Qualquer conduta abusiva, inadequada ou ilegal adotada por um jogador durante as partidas.</li>
            </ul>
            <p style={{ margin: 0 }}>
              Os usuários jogam inteiramente por sua própria conta, risco e responsabilidade, sabendo que as dinâmicas devem ser conduzidas num espírito esportivo e de comum acordo.
            </p>
          </section>

          {/* Section 4 */}
          <section id="bebidas">
            <h2 style={{ fontSize: "20px", color: "#0f172a", fontWeight: 800, marginTop: 0, marginBottom: "12px", borderBottom: "1px solid #e2e8f0", paddingBottom: "8px" }}>
              4. Consumo Voluntário de Álcool e Substâncias
            </h2>
            <p style={{ marginBottom: "12px" }}>
              Muitos jogos sociais são jogados em festas onde há consumo de bebidas alcoólicas. Contudo, <strong>o aplicativo Ma Que P#&*! não obriga, incentiva, patrocina ou promove o consumo de bebidas alcoólicas ou qualquer outra substância</strong>.
            </p>
            <p style={{ margin: 0 }}>
              Caso os jogadores optem voluntariamente por aplicar regras caseiras que envolvam a ingestão de álcool associada às falhas ou acertos no jogo, eles declaram expressamente fazê-lo de forma consciente, autônoma e respeitando seus próprios limites físicos e de saúde. Reiteramos que a responsabilidade por qualquer dano à integridade corporal decorrente da ingestão exagerada de substâncias é única e exclusiva dos próprios participantes.
            </p>
          </section>

          {/* Section 5 */}
          <section id="regras">
            <h2 style={{ fontSize: "20px", color: "#0f172a", fontWeight: 800, marginTop: 0, marginBottom: "12px", borderBottom: "1px solid #e2e8f0", paddingBottom: "8px" }}>
              5. Regras de Conduta e Consentimento Mútuo
            </h2>
            <p style={{ marginBottom: "12px" }}>
              Para garantir uma atmosfera divertida e amigável, todos os jogadores concordam em seguir estas diretrizes básicas:
            </p>
            <ul style={{ margin: "0 0 12px 0", paddingLeft: "20px" }}>
              <li><strong>Respeito mútuo:</strong> Nenhum participante é obrigado a responder a uma pergunta ou a executar um desafio. O direito de recusa (&quot;passar a vez&quot;) é garantido a todos sem punições reais ou retaliações;</li>
              <li><strong>Não coerção:</strong> É proibido forçar ou coagir qualquer pessoa a participar de dinâmicas contra sua vontade;</li>
              <li><strong>Segurança em primeiro lugar:</strong> Nunca tente executar um desafio físico que coloque você ou outras pessoas em risco de ferimentos.</li>
            </ul>
          </section>

          {/* Section 6 */}
          <section id="licenca">
            <h2 style={{ fontSize: "20px", color: "#0f172a", fontWeight: 800, marginTop: 0, marginBottom: "12px", borderBottom: "1px solid #e2e8f0", paddingBottom: "8px" }}>
              6. Licença de Uso e Limitação Técnica
            </h2>
            <p style={{ marginBottom: "12px" }}>
              Concedemos a você uma licença pessoal, limitada, revogável e não transferível para utilizar o software apenas para fins pessoais e recreativos. É proibido:
            </p>
            <ul style={{ margin: "0 0 12px 0", paddingLeft: "20px" }}>
              <li>Descompilar, realizar engenharia reversa ou copiar o conteúdo proprietário do jogo;</li>
              <li>Distribuir ou comercializar o conteúdo das cartas comercialmente sem nossa permissão explícita por escrito.</li>
            </ul>
          </section>

          {/* Section 7 */}
          <section id="modificacoes">
            <h2 style={{ fontSize: "20px", color: "#0f172a", fontWeight: 800, marginTop: 0, marginBottom: "12px", borderBottom: "1px solid #e2e8f0", paddingBottom: "8px" }}>
              7. Modificações nos Termos e Contato
            </h2>
            <p style={{ margin: 0 }}>
              Estes Termos de Uso podem ser alterados e atualizados a qualquer momento para refletir novas funcionalidades do aplicativo ou mudanças na legislação aplicável. O uso continuado do aplicativo após tais modificações constitui sua concordância com os termos revisados. Caso tenha qualquer dúvida ou feedback sobre este documento, entre em contato conosco por meio do canal de suporte da Google Play Store ou das plataformas oficiais de publicação do app.
            </p>
          </section>

        </div>

      </div>
    </div>
  );
}
