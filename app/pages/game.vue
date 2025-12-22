<script setup lang="ts">
import { useGameStore } from '~/stores/game'
import { useRouter } from 'vue-router'
import type { Session } from "~/models/session";
import type { Player } from '~/models/player'

const showSessionForm = ref(false)
const showFinishModal = ref(false)
const editingSession = ref<Session | null>(null)
const selectedPlayer = ref<Player | null>(null)

const gameStore = useGameStore()
const router = useRouter()

if (!gameStore.game) {
    router.replace('/')
}
</script>

<template>
    <div class="p-4 space-y-4 bg-gray-900">
        <header class="">
            <h2 class="text-xl font-bold text-center">Game Berlangsung</h2>
        </header>

        <section class="sticky bottom-0 pt-2 border-t space-y-2">
            <h3 class="font-semibold text-center">Peringkat</h3>
            <RankingPanel />
        </section>

        <section class="sticky bottom-0 pt-2 mt-6 border-t space-y-2">
            <h3 class="font-semibold text-center">Tabel Skor</h3>
            <ScoreTable @edit="editingSession = $event" @replace="selectedPlayer = $event" />
        </section>

        <div class="flex gap-2">
            <button class="flex-1 text-sm p-2 px-4 rounded text-gray-50 bg-red-700" @click="showFinishModal = true">
                Akhiri Game
            </button>

            <button class="flex-1 bg-yellow-700 rounded py-2 disabled:opacity-40"
                :disabled="gameStore.sessions.length === 0" @click="gameStore.undoLastSession()">
                Hapus Sesi
            </button>

            <button class="flex-1 bg-cyan-500 text-white rounded py-2" @click="showSessionForm = true">
                Tambah Sesi
            </button>
        </div>
        <ScoreSessionForm v-if="showSessionForm" @close="showSessionForm = false" />
        <EditSessionModal v-if="editingSession" :session="editingSession" @close="editingSession = null" />
        <ReplacePlayerModal v-if="selectedPlayer" :player="selectedPlayer" @close="selectedPlayer = null" />
        <FinishGameModal v-if="showFinishModal" @close="showFinishModal = false" />
    </div>
</template>