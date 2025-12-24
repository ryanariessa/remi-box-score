<script setup lang="ts">
import { ref, computed } from 'vue'
import { useGameStore } from '~/stores/game'
import type { Player } from '~/models/player'

const props = defineProps<{ player: Player }>()
const emit = defineEmits<{ (e: 'close'): void }>()

const gameStore = useGameStore()

const name = ref(props.player.name)
const touched = ref(false)

const error = computed(() => {
  if (!touched.value) return null

  const trimmed = name.value.trim()
  if (!trimmed) return 'Nama pemain wajib diisi'

  const duplicate = gameStore.players.some(
    p => p.id !== props.player.id &&
      p.name.toLowerCase() === trimmed.toLowerCase()
  )

  if (duplicate) return 'Nama pemain sudah digunakan'
  return null
})

const isValid = computed(() => error.value === null)

const submit = () => {
  if (!isValid.value) return
  gameStore.replacePlayer(props.player.id, name.value.trim())
  emit('close')
}
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center
           bg-black/40 dark:bg-black/70">
    <div class="w-full max-w-md rounded-xl p-4 space-y-4
             bg-white dark:bg-zinc-900
             text-zinc-900 dark:text-zinc-100">
      <h3 class="font-semibold text-lg">
        Ganti Nama Pemain
      </h3>

      <div class="space-y-1">
        <input v-model="name" @input="touched = true" type="text" placeholder="Nama pemain" class="w-full rounded p-2 transition
                 bg-zinc-50 dark:bg-zinc-800
                 border border-zinc-300 dark:border-zinc-700
                 text-zinc-900 dark:text-zinc-100
                 focus:outline-none focus:ring-2 focus:ring-violet-500"
          :class="error && 'border-red-500 animate-shake'" />

        <p v-if="error" class="text-xs text-red-600 dark:text-red-400">
          {{ error }}
        </p>
      </div>

      <div class="flex gap-2">
        <button class="flex-1 py-2 rounded text-white
        bg-violet-600 hover:bg-violet-700
        disabled:opacity-40" :disabled="!isValid" @click="submit">
          Simpan
        </button>
        <button class="flex-1 py-2 rounded
               border border-zinc-300 dark:border-zinc-700
               text-zinc-700 dark:text-zinc-300" @click="$emit('close')">
          Batal
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes shake {
  0% {
    transform: translateX(0);
  }

  25% {
    transform: translateX(-4px);
  }

  50% {
    transform: translateX(4px);
  }

  75% {
    transform: translateX(-4px);
  }

  100% {
    transform: translateX(0);
  }
}

.animate-shake {
  animation: shake 0.2s ease-in-out;
}
</style>