<script setup lang="ts">
import { useGameStore } from '~/stores/game'
import { exportGameToPDF } from '~/utils/exportPdf'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'

const emit = defineEmits<{ (e: 'close'): void }>()

const gameStore = useGameStore()
const router = useRouter()

const finishAndBack = () => {
  gameStore.resetGame()
  router.push('/')
  emit('close')
}

const download = () => {
  if (gameStore.game) {
    exportGameToPDF(gameStore.game)
  }
  finishAndBack()
}

const skip = async () => {
  const result = await Swal.fire({
    title: 'Yakin melewati?',
    text: 'Hasil permainan akan dihapus dan tidak dapat dikembalikan.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Ya, lewati',
    cancelButtonText: 'Batal',
    reverseButtons: true,
    confirmButtonColor: '#7c3aed', // violet-600
    cancelButtonColor: '#6b7280'   // gray-500
  })

  if (result.isConfirmed) {
    finishAndBack()
  }
}
</script>

<template>
  <div class="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
    <div
      class="w-full max-w-md rounded-xl p-5 space-y-4
             bg-white dark:bg-gray-800
             text-gray-900 dark:text-gray-100"
    >
      <h3 class="text-lg font-semibold text-center">
        Permainan Selesai
      </h3>

      <p class="text-sm text-gray-600 dark:text-gray-300 text-center">
        Apakah Anda ingin mengunduh hasil permainan dalam bentuk PDF?
      </p>

      <div class="flex flex-col gap-2 pt-2">
        <!-- PRIMARY -->
        <button
          class="w-full py-2 rounded-lg font-medium
                 bg-violet-600 hover:bg-violet-700
                 text-white transition"
          @click="download"
        >
          Unduh PDF
        </button>

        <!-- DANGER -->
        <button
          class="w-full py-2 rounded-lg font-medium
                 bg-red-600 hover:bg-red-700
                 text-white transition"
          @click="skip"
        >
          Lewati (Tanpa Unduh)
        </button>

        <!-- SECONDARY -->
        <button
          class="w-full py-2 rounded-lg font-medium
                 bg-gray-200 hover:bg-gray-300
                 dark:bg-gray-700 dark:hover:bg-gray-600
                 text-gray-800 dark:text-gray-100
                 transition"
          @click="emit('close')"
        >
          Batal
        </button>
      </div>
    </div>
  </div>
</template>