<script setup lang="ts">
import { ref } from 'vue'
import { useGameStore } from '~/stores/game'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'
import type { Session } from '~/models/session'
import type { Player } from '~/models/player'

definePageMeta({
    middleware: ['game-guard']
})

const gameStore = useGameStore()
const router = useRouter()

const showSessionForm = ref(false)
const showFinishModal = ref(false)
const editingSession = ref<Session | null>(null)
const selectedPlayer = ref<Player | null>(null)

/* SAFETY */
if (!gameStore.game) {
    router.replace('/')
}

/* ================= ACTIONS ================= */
const confirmUndoSession = async () => {
    if (gameStore.sessions.length === 0) return

    const result = await Swal.fire({
        title: 'Hapus sesi terakhir?',
        text: 'Skor pada sesi terakhir akan dihapus dan tidak dapat dikembalikan.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Ya, hapus',
        cancelButtonText: 'Batal',
        reverseButtons: true,
        confirmButtonColor: '#ef4444', // red-500
        cancelButtonColor: '#64748b'   // slate-500
    })

    if (result.isConfirmed) {
        gameStore.undoLastSession()

        Swal.fire({
            title: 'Sesi dihapus',
            text: 'Sesi terakhir berhasil dihapus.',
            icon: 'success',
            timer: 1200,
            showConfirmButton: false
        })
    }
}
</script>

<template>
    <div class="flex items-center justify-center p-4">
        <div class="w-full max-w-md space-y-6 bg-card p-6 rounded-xl shadow">

            <!-- HEADER -->
            <header>
                <h2 class="text-xl font-bold text-center">
                    Game Berlangsung
                </h2>
            </header>

            <!-- RANKING -->
            <section class="pt-4 border-t border-border space-y-2">
                <h3 class="font-semibold text-center text-muted-foreground">
                    Peringkat
                </h3>
                <RankingPanel />
            </section>

            <!-- SCORE TABLE -->
            <section class="pt-4 border-t border-border space-y-2">
                <h3 class="font-semibold text-center text-muted-foreground">
                    Tabel Skor
                </h3>

                <ScoreTable @edit="editingSession = $event" @replace="selectedPlayer = $event" />
            </section>

            <!-- ACTIONS -->
            <div class="flex flex-col sm:flex-row gap-2 pt-4">
                <!-- Finish -->
                <button class="flex-1 rounded py-2 text-sm font-semibold
                 bg-violet-500 text-violet-500-foreground
                 hover:opacity-90 transition" @click="showFinishModal = true">
                    Akhiri Game
                </button>

                <!-- Undo Session -->
                <button class="flex-1 rounded py-2 text-sm font-semibold
                 bg-red-500 text-red-500-foreground
                 disabled:opacity-40 transition" :disabled="gameStore.sessions.length === 0"
                    @click="confirmUndoSession">
                    Hapus Sesi
                </button>

                <!-- Add Session -->
                <button class="flex-1 rounded py-2 text-sm font-semibold
                 bg-secondary text-secondary-foreground
                 hover:opacity-90 transition" @click="showSessionForm = true">
                    Tambah Sesi
                </button>
            </div>

            <!-- MODALS -->
            <ScoreSessionForm v-if="showSessionForm" @close="showSessionForm = false" />

            <EditSessionModal v-if="editingSession" :session="editingSession" @close="editingSession = null" />

            <ReplacePlayerModal v-if="selectedPlayer" :player="selectedPlayer" @close="selectedPlayer = null" />

            <FinishGameModal v-if="showFinishModal" @close="showFinishModal = false" />
        </div>
    </div>
</template>