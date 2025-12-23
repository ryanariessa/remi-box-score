<script setup lang="ts">
import { reactive, computed, ref } from 'vue'
import { useGameStore } from '~/stores/game'
import { validateScore } from '~/utils/score'
import type { Session } from '~/models/session'

const props = defineProps<{
  session: Session
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

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
  <div class="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
    <div class="bg-gray-800 w-full max-w-md rounded-xl p-4 space-y-4">

      <h3 class="font-semibold text-lg text-gray-100 text-center">
        Edit Sesi {{ props.session.index }}
      </h3>

      <!-- INPUT LIST -->
      <div class="space-y-3">
        <div
          v-for="player in gameStore.players"
          :key="player.id"
          class="space-y-1"
        >
          <div class="flex items-center gap-2">
            <span class="w-24 truncate text-gray-200">
              {{ player.name }}
            </span>

            <input
              type="number"
              v-model.number="form[player.id]"
              @input="touched[player.id] = true"
              class="flex-1 border rounded p-2 text-right bg-gray-900 text-gray-100 transition"
              :class="errors[player.id]
                ? 'border-red-500 animate-shake'
                : 'border-gray-600 focus:border-white'
              "
            />
          </div>

          <!-- ERROR -->
          <p
            v-if="errors[player.id]"
            class="text-xs text-red-400 pl-[6.5rem]"
          >
            {{ errors[player.id] }}
          </p>
        </div>
      </div>

      <!-- ACTION -->
      <div class="flex gap-2 pt-2">
        <button
          class="flex-1 bg-violet-700 text-white rounded py-2 disabled:opacity-40"
          :disabled="!isValid"
          @click="submit"
        >
          Simpan
        </button>

        <button
          class="flex-1 rounded bg-black py-2 text-gray-200"
          @click="$emit('close')"
        >
          Batal
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