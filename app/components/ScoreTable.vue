<script setup lang="ts">
import { computed } from 'vue'
import { useGameStore } from '~/stores/game'
import type { Session } from '~/models/session'
import type { Player } from '~/models/player'

const gameStore = useGameStore()

const sessions = computed(() => gameStore.sessions)
const players = computed(() => gameStore.players)

const getScore = (playerId: string, sessionId: string) => {
    const session = gameStore.sessions.find(s => s.id === sessionId)
    return session?.scores.find(s => s.playerId === playerId)?.score ?? ''
}

const getTotalScores = () => {
    return players.value.map(player =>
        gameStore.totalScoreByPlayer(player.id)
    )
}

const getTotalScoreClass = (playerId: string) => {
    const totals = getTotalScores()
    if (totals.length === 0) return 'text-gray-300'

    const max = Math.max(...totals)
    const min = Math.min(...totals)

    const playerTotal = gameStore.totalScoreByPlayer(playerId)

    if (playerTotal === max) return 'text-green-300 font-bold'
    if (playerTotal === min) return 'text-red-300 font-bold'

    return 'text-gray-300 font-bold'
}

const getScoreClass = (playerId: string, sessionId: string) => {
    const session = gameStore.sessions.find(s => s.id === sessionId)
    if (!session) return 'text-gray-300'

    const scores = session.scores.map(s => s.score)
    if (scores.length === 0) return 'text-gray-300'

    const max = Math.max(...scores)
    const min = Math.min(...scores)

    const playerScore =
        session.scores.find(s => s.playerId === playerId)?.score

    if (playerScore === undefined) return 'text-gray-300'

    if (playerScore === max) return 'text-green-300 font-semibold'
    if (playerScore === min) return 'text-red-300 font-semibold'

    return 'text-gray-300'
}

defineEmits<{
    (e: 'edit', session: Session): void
    (e: 'replace', player: Player): void
}>()
</script>

<template>
    <div class="overflow-x-auto border rounded">
        <table class="min-w-full text-sm border-collapse">
            <thead>
                <!-- 🔹 HEADER -->
                <tr class="bg-gray-800">
                    <th class="p-2 text-left sticky left-0 text-gray-50 z-10">
                        Pemain
                    </th>

                    <th v-for="player in players" :key="player.id">
                        <button class="p-2 text-center text-gray-50 font-semibold underline" @click="$emit('replace', player)">
                            {{ player.name }}
                        </button>
                    </th>
                </tr>
            </thead>

            <tbody>
                <!-- 🔹 BARIS SESI -->
                <tr v-for="session in sessions" :key="session.id">
                    <td class="p-2 sticky left-0 bg-gray-800 text-gray-50 cursor-pointer underline font-medium"
                        @click="$emit('edit', session)">
                        Sesi {{ session.index }}
                    </td>

                    <td v-for="player in players" :key="player.id" class="p-2 text-center"
                        :class="getScoreClass(player.id, session.id)">
                        {{ getScore(player.id, session.id) }}
                    </td>
                </tr>

                <!-- 🔹 BARIS TOTAL -->
                <tr class="bg-gray-800 font-semibold">
                    <td class="p-2 sticky left-0 bg-gray-750 text-gray-50">
                        Total
                    </td>

                    <td v-for="player in players" :key="player.id" class="p-2 text-center z-10"
                        :class="getTotalScoreClass(player.id)">
                        {{ gameStore.totalScoreByPlayer(player.id) }}
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>