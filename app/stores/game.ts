import { defineStore } from "pinia";
import type { Game } from "~/models/game";
import type { Player } from "~/models/player";
import type { Session, SessionScore } from "~/models/session";
import { uid } from "~/utils/id";

const STORAGE_KEY = "remi-box-active-game";

export const useGameStore = defineStore("game", {
  state: () => ({
    game: null as Game | null,
  }),

  /* ================= GETTERS ================= */
  getters: {
    players: (state) => state.game?.players ?? [],
    sessions: (state) => state.game?.sessions ?? [],

    totalScoreByPlayer: (state) => {
      return (playerId: string): number => {
        if (!state.game) return 0;

        return state.game.sessions.reduce((sum, session) => {
          const s = session.scores.find(
            (sc) => sc.playerId === playerId
          );
          return sum + (s?.score ?? 0);
        }, 0);
      };
    },

    ranking: (state) => {
      if (!state.game) return [];

      const lastSession = state.game.sessions.at(-1);
      const game = state.game;

      const rows = game.players.map((player) => {
        const total = game.sessions.reduce((sum, session) => {
          const s = session.scores.find(
            (sc) => sc.playerId === player.id
          );
          return sum + (s?.score ?? 0);
        }, 0);

        const lastScore =
          lastSession?.scores.find((s) => s.playerId === player.id)
            ?.score ?? 0;

        return { player, total, lastScore };
      });

      rows.sort((a, b) => {
        if (b.total !== a.total) return b.total - a.total;
        if (b.lastScore !== a.lastScore)
          return b.lastScore - a.lastScore;
        return 0;
      });

      return rows;
    },
  },

  /* ================= ACTIONS ================= */
  actions: {
    /* 🔁 INIT (LOAD DARI LOCALSTORAGE) */
    init() {
      if (!import.meta.client) return;

      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        try {
          this.game = JSON.parse(raw);
        } catch {
          localStorage.removeItem(STORAGE_KEY);
          this.game = null;
        }
      }

      this.$subscribe((_, state) => {
        if (state.game) {
          localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(state.game)
          );
        } else {
          localStorage.removeItem(STORAGE_KEY);
        }
      });
    },

    /* 💾 SAVE (LIVE UPDATE) */
    saveToStorage() {
      if (!import.meta.client) return;

      if (this.game) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.game));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    },

    /* 🆕 BUAT GAME BARU */
    startGame(playerNames: string[]) {
      const players: Player[] = playerNames.map((name) => ({
        id: uid(),
        name,
      }));

      this.game = {
        id: uid(),
        players,
        sessions: [],
        status: "active",
        createdAt: Date.now(),
      };

      this.saveToStorage();
    },

    /* ➕ TAMBAH SESI */
    addSession(scores: SessionScore[]) {
      if (!this.game) return;

      const session: Session = {
        id: uid(),
        index: this.game.sessions.length + 1,
        scores,
        createdAt: Date.now(),
      };

      this.game.sessions.push(session);
      this.saveToStorage();
    },

    /* ✏️ EDIT SESI */
    updateSession(sessionId: string, scores: SessionScore[]) {
      if (!this.game) return;

      const session = this.game.sessions.find(
        (s) => s.id === sessionId
      );
      if (!session) return;

      session.scores = scores;
      this.saveToStorage();
    },

    /* ↩️ UNDO SESI TERAKHIR */
    undoLastSession() {
      if (!this.game) return;

      this.game.sessions.pop();
      this.saveToStorage();
    },

    /* 🔁 GANTI PEMAIN (SKOR LANJUT) */
    replacePlayer(oldPlayerId: string, newName: string) {
      if (!this.game) return;

      const player = this.game.players.find(
        (p) => p.id === oldPlayerId
      );
      if (!player) return;

      player.name = newName;
      this.saveToStorage();
    },

    /* 🏁 FINISH GAME */
    finishGame() {
      if (!this.game) return;

      this.game.status = "finished";
      this.game.finishedAt = Date.now();
      this.saveToStorage();
    },

    /* 🔄 RESET GAME */
    resetGame() {
      this.game = null;
      this.saveToStorage();
    },
  },
});
