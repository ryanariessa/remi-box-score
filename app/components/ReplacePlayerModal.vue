<script setup lang="ts">
import { ref, computed } from 'vue'
import { useGameStore } from '~/stores/game'
import type { Player } from '~/models/player'

const props = defineProps<{
  player: Player
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const gameStore = useGameStore()

/* ================= STATE ================= */
const name = ref(props.player.name)
const touched = ref(false)

/* ================= VALIDATION ================= */
const error = computed(() => {
  if (!touched.value) return null

  const trimmed = name.value.trim()

  if (!trimmed) {
    return 'Nama pemain wajib diisi'
  }

  const duplicate = gameStore.players.some(
    p => p.id !== props.player.id &&
         p.name.toLowerCase() === trimmed.toLowerCase()
  )

  if (duplicate) {
    return 'Nama pemain sudah digunakan'
  }

  return null
})

const isValid = computed(() => error.value === null)

/* ================= SUBMIT ================= */
const submit = () => {
  if (!isValid.value) return

  gameStore.replacePlayer(props.player.id, name.value.trim())
  emit('close')
}
</script>

<template>
  <div class="fixed inset-0 bg-black/60 flex items-end justify-center z-50">
    <div class="bg-gray-800 w-full max-w-md rounded-t-xl p-4 space-y-4">

      <h3 class="font-semibold text-lg text-gray-100">
        Ganti Nama Pemain
      </h3>

      <!-- INPUT -->
      <div class="space-y-1">
        <input
          v-model="name"
          @input="touched = true"
          type="text"
          placeholder="Nama pemain"
          class="w-full border rounded p-2 bg-gray-900 text-gray-100 transition"
          :class="error
            ? 'border-red-500 animate-shake'
            : 'border-gray-600 focus:border-white'
          "
        />

        <!-- ERROR -->
        <p v-if="error" class="text-xs text-red-400">
          {{ error }}
        </p>
      </div>

      <!-- ACTION -->
      <div class="flex gap-2">
        <button
          class="flex-1 border border-gray-600 py-2 rounded text-gray-200"
          @click="$emit('close')"
        >
          Batal
        </button>

        <button
          class="flex-1 bg-violet-700 text-white py-2 rounded disabled:opacity-40"
          :disabled="!isValid"
          @click="submit"
        >
          Simpan
        </button>
      </div>

    </div>
  </div>
</template>

<style scoped>
/* 🔥 Shake animation */
@keyframes shake {
  0% { transform: translateX(0); }
  25% { transform: translateX(-4px); }
  50% { transform: translateX(4px); }
  75% { transform: translateX(-4px); }
  100% { transform: translateX(0); }
}
.animate-shake {
  animation: shake 0.2s ease-in-out;
}
</style>