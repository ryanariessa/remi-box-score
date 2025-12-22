<script setup lang="ts">
import { ref } from 'vue'
import { useGameStore } from '~/stores/game'
import type { Player } from '~/models/player'

const props = defineProps<{
  player: Player
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const gameStore = useGameStore()
const newName = ref(props.player.name)

const submit = () => {
  gameStore.replacePlayer(props.player.id, newName.value)
  emit('close')
}
</script>

<template>
  <div class="fixed inset-0 bg-black/40 flex items-end justify-center">
    <div class="bg-white w-full max-w-md rounded-t-xl p-4 space-y-4">
      <h3 class="font-semibold text-lg">Ganti Pemain</h3>

      <input
        v-model="newName"
        class="w-full border rounded p-2"
      />

      <div class="flex gap-2">
        <button class="flex-1 bg-gray-800 py-2 rounded" @click="$emit('close')">
          Batal
        </button>

        <button class="flex-1 bg-violet-700 text-white py-2 rounded" @click="submit">
          Simpan
        </button>
      </div>
    </div>
  </div>
</template>