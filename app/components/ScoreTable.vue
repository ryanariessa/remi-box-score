<script setup lang="ts">
import { computed } from 'vue'
import { useGameStore } from '~/stores/game'
import type { Session } from '~/models/session'
import type { Player } from '~/models/player'

const gameStore = useGameStore()

const sessions = computed(() => gameStore.sessions)
const players = computed(() => gameStore.players)

/* ================= HELPERS ================= */
const getScore = (playerId: string, sessionId: string) => {
  const session = gameStore.sessions.find(s => s.id === sessionId)
  return session?.scores.find(s => s.playerId === playerId)?.score ?? ''
}

const getSessionStats = (sessionId: string) => {
  const session = gameStore.sessions.find(s => s.id === sessionId)
  if (!session || session.scores.length === 0) return null

  const values = session.scores.map(s => s.score)
  return {
    max: Math.max(...values),
    min: Math.min(...values)
  }
}

const getTotalStats = computed(() => {
  if (players.value.length === 0) return null

  const totals = players.value.map(p =>
    gameStore.totalScoreByPlayer(p.id)
  )

  return {
    max: Math.max(...totals),
    min: Math.min(...totals)
  }
})

const scoreClass = (
  playerId: string,
  sessionId: string
) => {
  const session = gameStore.sessions.find(s => s.id === sessionId)
  if (!session) return ''

  const stat = getSessionStats(sessionId)
  const score = session.scores.find(s => s.playerId === playerId)?.score
  if (score === undefined || !stat) return ''

  if (score === stat.max) return 'text-green-500 font-semibold'
  if (score === stat.min) return 'text-red-500 font-semibold'

  return 'text-gray-700 dark:text-gray-300'
}

const totalClass = (playerId: string) => {
  const stat = getTotalStats.value
  if (!stat) return ''

  const total = gameStore.totalScoreByPlayer(playerId)

  if (total === stat.max) return 'text-green-600 dark:text-green-400 font-bold'
  if (total === stat.min) return 'text-red-600 dark:text-red-400 font-bold'

  return 'text-gray-800 dark:text-gray-200 font-semibold'
}

/* ================= EMITS ================= */
defineEmits<{
  (e: 'edit', session: Session): void
  (e: 'replace', player: Player): void
}>()
</script>

<template>
  <div class="overflow-x-auto rounded-lg border border-gray-300 dark:border-gray-700">
    <table class="min-w-full text-sm border-collapse">
      <!-- ================= HEADER ================= -->
      <thead class="bg-gray-200 dark:bg-gray-800">
        <tr>
          <th
            class="p-2 text-left sticky left-0 z-10 bg-gray-200 dark:bg-gray-800"
          >
            Pemain
          </th>

          <th
            v-for="player in players"
            :key="player.id"
            class="p-2 text-center"
          >
            <button
              class="font-semibold underline text-gray-800 dark:text-gray-100 hover:opacity-80"
              @click="$emit('replace', player)"
            >
              {{ player.name }}
            </button>
          </th>
        </tr>
      </thead>

      <!-- ================= BODY ================= -->
      <tbody>
        <!-- 🔹 BARIS SESI -->
        <tr
          v-for="session in sessions"
          :key="session.id"
          class="border-t border-gray-200 dark:border-gray-700"
        >
          <td
            class="p-2 sticky left-0 bg-gray-100 dark:bg-gray-900 font-medium underline cursor-pointer"
            @click="$emit('edit', session)"
          >
            Sesi {{ session.index }}
          </td>

          <td
            v-for="player in players"
            :key="player.id"
            class="p-2 text-center transition"
            :class="scoreClass(player.id, session.id)"
          >
            {{ getScore(player.id, session.id) }}
          </td>
        </tr>

        <!-- 🔹 BARIS TOTAL -->
        <tr class="border-t-2 border-gray-400 dark:border-gray-600">
          <td
            class="p-2 sticky left-0 bg-gray-300 dark:bg-gray-800 font-bold"
          >
            Total
          </td>

          <td
            v-for="player in players"
            :key="player.id"
            class="p-2 text-center transition"
            :class="totalClass(player.id)"
          >
            {{ gameStore.totalScoreByPlayer(player.id) }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>