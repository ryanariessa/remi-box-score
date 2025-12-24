<script setup lang="ts">
import { reactive, computed, ref } from 'vue'
import { useGameStore } from '~/stores/game'
import { validateScore } from '~/utils/score'
import type { Session } from '~/models/session'

const props = defineProps<{ session: Session }>()

const emit = defineEmits<{ (e: 'close'): void }>()

const gameStore = useGameStore()

/* ================= STATE ================= */
const form = reactive<Record<string, number>>({})
const touched = ref<Record<string, boolean>>({})

props.session.scores.forEach(s => {
  form[s.playerId] = s.score
  touched.value[s.playerId] = false
})

/* ================= VALIDATION ================= */
const errors = computed(() => {
  const result: Record<string, string | null> = {}

  for (const [playerId, value] of Object.entries(form)) {
    if (!touched.value[playerId]) {
      result[playerId] = null
      continue
    }
    result[playerId] = validateScore(value)
  }

  return result
})

const isValid = computed(() =>
  Object.values(errors.value).every(e => e === null)
)

/* ================= SUBMIT ================= */
const submit = () => {
  if (!isValid.value) return

  gameStore.updateSession(
    props.session.id,
    Object.entries(form).map(([playerId, score]) => ({
      playerId,
      score
    }))
  )

  emit('close')
}
</script>

<template>
  <!-- BACKDROP -->
  <div class="fixed inset-0 z-50 flex items-center justify-center
           bg-black/40 dark:bg-black/70">
    <!-- MODAL -->
    <div class="w-full max-w-md rounded-xl p-4 space-y-4
             bg-white text-gray-900
             dark:bg-zinc-900 dark:text-gray-100
             shadow-xl">
      <h3 class="text-lg font-semibold text-center">
        Edit Sesi {{ props.session.index }}
      </h3>

      <!-- INPUT LIST -->
      <div class="space-y-3">
        <div v-for="player in gameStore.players" :key="player.id" class="space-y-1">
          <div class="flex items-center gap-2">
            <span class="w-24 truncate text-sm opacity-80">
              {{ player.name }}
            </span>

            <input type="number" v-model.number="form[player.id]" @input="touched[player.id] = true" class="flex-1 rounded border p-2 text-right transition
                     bg-white border-gray-300 text-gray-900
                     focus:border-gray-500 focus:outline-none
                     dark:bg-zinc-800 dark:border-zinc-600 dark:text-gray-100
                     dark:focus:border-gray-300" :class="errors[player.id] && 'border-red-500 animate-shake'" />
          </div>

          <!-- ERROR -->
          <p v-if="errors[player.id]" class="text-xs text-red-600 dark:text-red-400 pl-[6.5rem]">
            {{ errors[player.id] }}
          </p>
        </div>
      </div>

      <!-- ACTION -->
      <div class="flex gap-2 pt-2">
        <button :disabled="!isValid" @click="submit" class="flex-1 rounded py-2 font-semibold
                 bg-violet-600 text-white
                 hover:bg-violet-700
                 disabled:opacity-40 disabled:cursor-not-allowed">
          Simpan
        </button>

        <button @click="$emit('close')" class="flex-1 py-2 rounded
               border border-zinc-300 dark:border-zinc-700
               text-zinc-700 dark:text-zinc-300">
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
</style>