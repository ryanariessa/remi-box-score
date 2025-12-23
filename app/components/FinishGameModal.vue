<script setup lang="ts">
import { useGameStore } from '~/stores/game'
import { exportGameToPDF } from '~/utils/exportPdf'
import { useRouter } from 'vue-router'

const emit = defineEmits<{ (e: 'close'): void }>()

const gameStore = useGameStore()
const router = useRouter()

const download = () => {
    if (gameStore.game) {
        exportGameToPDF(gameStore.game)
    }
    gameStore.resetGame()
    router.push('/')
    emit('close')
}

const skip = () => {
    gameStore.resetGame()
    router.push('/')
    emit('close')
}
</script>

<template>
    <div class="fixed inset-0 bg-black/80 flex items-center justify-center">
        <div class="bg-gray-800 w-full max-w-md rounded-xl p-4 space-y-4">
            <h3 class="text-lg font-semibold">Permainan Selesai</h3>

            <p class="text-sm text-gray-50">
                Apakah Anda ingin mengunduh hasil permainan dalam bentuk PDF?
            </p>

            <div class="flex gap-2">
                <button class="flex-1 py-2 rounded bg-violet-700 text-white" @click="download">
                    Unduh PDF
                </button>
                <button class="flex-1 py-2 rounded bg-gray-500 text-white" @click="skip">
                    Lewati
                </button>
                <button class="flex-1 py-2 rounded bg-black text-white" @click="emit('close')">
                    Batal
                </button>
            </div>
        </div>
    </div>
</template>