import { useGameStore } from "~/stores/game";

export default defineNuxtRouteMiddleware(() => {
  const gameStore = useGameStore();

  if (gameStore.game && gameStore.game.status !== "active") {
    return navigateTo("/");
  }
});