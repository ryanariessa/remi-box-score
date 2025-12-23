import { useGameStore } from '~/stores/game'

export default defineNuxtRouteMiddleware(() => {
  const gameStore = useGameStore()

  if (!gameStore.game) return

  if (gameStore.game.status === 'active') {
    return navigateTo('/game')
  }
})