<script setup lang="ts">
import { computed, reactive } from 'vue'
import { useGameStore } from '~/stores/game'
import { validateScore } from '~/utils/score'

const emit = defineEmits<{
  (e: 'close'): void
}>()

const gameStore = useGameStore()

const form = reactive<Record<string, number | null>>({})

gameStore.players.forEach(player => {
  form[player.id] = null
})

const errors = computed(() => {
  const result: Record<string, string | null> = {}
  for (const [playerId, value] of Object.entries(form)) {
    if (value === null) {
      result[playerId] = 'Wajib diisi'
    } else {
      result[playerId] = validateScore(value)
    }
  }
  return result
})

const isValid = computed(() =>
  Object.values(errors.value).every(e => e === null)
)

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
  <div class="fixed inset-0 bg-black/40 flex items-end justify-center">
    <div class="bg-gray-700 w-full max-w-md rounded-t-xl p-4 space-y-4">
      <h3 class="font-semibold text-lg text-black text-center">Input Skor Sesi</h3>

      <div class="space-y-3">
        <div v-for="player in gameStore.players" :key="player.id" class="flex items-center gap-2">
          <span class="w-24 truncate">{{ player.name }}</span>

          <input type="number" v-model.number="form[player.id]" class="flex-1 border rounded p-2 text-right" />

          <span v-if="errors[player.id]" class="text-red-500 text-xs">
            {{ errors[player.id] }}
          </span>
        </div>
      </div>

      <div class="flex gap-2 pt-2">
        <button class="flex-1 rounded bg-gray-800 py-2" @click="$emit('close')">
          Batal
        </button>

        <button class="flex-1 bg-violet-700 text-white rounded py-2 disabled:opacity-40" :disabled="!isValid"
          @click="submit">
          Simpan
        </button>
      </div>
    </div>
  </div>
</template>