<script setup lang="ts">
import { computed, reactive } from 'vue'
import { useGameStore } from '~/stores/game'
import { validateScore } from '~/utils/score'

const emit = defineEmits<{ (e: 'close'): void }>()

const gameStore = useGameStore()

/* ================= STATE ================= */
const form = reactive<Record<string, number | null>>({})
const touched = reactive<Record<string, boolean>>({})

gameStore.players.forEach(player => {
  form[player.id] = null
  touched[player.id] = false
})

/* ================= VALIDATION ================= */
const errors = computed(() => {
  const result: Record<string, string | null> = {}

  for (const [playerId, value] of Object.entries(form)) {
    if (!touched[playerId]) {
      result[playerId] = null
      continue
    }

    if (value === null) {
      result[playerId] = 'Wajib diisi'
      continue
    }

    result[playerId] = validateScore(value)
  }

  return result
})

const isValid = computed(() =>
  Object.values(form).every(v => v !== null) &&
  Object.values(errors.value).every(e => e === null)
)

/* ================= SUBMIT ================= */
const submit = () => {
  if (!isValid.value) return

  gameStore.addSession(
    Object.entries(form).map(([playerId, score]) => ({
      playerId,
      score: score as number
    }))
  )

  emit('close')
}
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center
           bg-black/40 dark:bg-black/70">
    <div class="w-full max-w-md rounded-xl p-4 space-y-4
             bg-white text-gray-900
             dark:bg-zinc-900 dark:text-gray-100
             shadow-xl">
      <h3 class="font-semibold text-lg text-center">
        Input Skor Sesi
      </h3>

      <!-- INPUT LIST -->
      <div class="space-y-3">
        <div v-for="player in gameStore.players" :key="player.id" class="space-y-1">
          <div class="flex items-center gap-2">
            <span class="w-24 truncate text-sm">
              {{ player.name }}
            </span>

            <input type="number" v-model.number="form[player.id]" @input="touched[player.id] = true"
              placeholder="± skor" class="flex-1 rounded p-2 text-right transition border
                     bg-white dark:bg-zinc-900
                     text-zinc-900 dark:text-zinc-100" :class="errors[player.id]
                      ? 'border-red-500 animate-shake'
                      : 'border-zinc-300 dark:border-zinc-600 focus:border-zinc-900 dark:focus:border-white'
                      " />
          </div>

          <!-- ERROR -->
          <transition name="fade">
            <p v-if="errors[player.id]" class="text-xs pl-[6.5rem] text-red-600 dark:text-red-400">
              {{ errors[player.id] }}
            </p>
          </transition>
        </div>
      </div>

      <!-- ACTION -->
      <div class="flex gap-2 pt-2">
        <button class="flex-1 rounded py-2 font-medium
                 bg-violet-600 hover:bg-violet-700
                 text-white
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
/* 🔥 Shake animation */
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

/* ✨ Error fade */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>