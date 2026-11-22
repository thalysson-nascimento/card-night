"use client";

import { useI18n } from "../i18n/provider";

import { useRef } from "react";
import { LogOut } from "lucide-react";
import styles from "./ExitButton.module.css";

export default function ExitButton({ onExit }: { onExit: () => void }) {
  const { t } = useI18n();
  const dialogRef = useRef<HTMLDialogElement>(null);
  return (
    <>
      <button
        type="button"
        className={styles.exitButton}
        onClick={() => dialogRef.current?.showModal()}
        aria-label={t("Sair da partida")}
        title={t("Sair da partida")}
      >
        <LogOut size={20} aria-hidden="true" />
      </button>
      <dialog
        ref={dialogRef}
        className={styles.dialog}
        aria-labelledby="exit-title"
        aria-describedby="exit-description"
      >
        <h2 id="exit-title">{t("Sair do jogo?")}</h2>
        <p id="exit-description">
          {t(
            "A partida atual será encerrada. Deseja voltar para a tela de jogadores?",
          )}
        </p>
        <div className={styles.actions}>
          <button
            type="button"
            className="btn-neon"
            autoFocus
            onClick={() => dialogRef.current?.close()}
          >
            {t("Continuar jogando")}
          </button>
          <button
            type="button"
            className="btn-neon btn-neon-pink"
            onClick={() => {
              dialogRef.current?.close();
              onExit();
            }}
          >
            {t("Sair do jogo")}
          </button>
        </div>
      </dialog>
    </>
  );
}
