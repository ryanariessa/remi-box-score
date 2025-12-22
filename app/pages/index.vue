<script setup lang="ts">
import { ref, computed } from 'vue'
import { useGameStore } from '~/stores/game'
import { useRouter } from 'vue-router'

const gameStore = useGameStore()
const router = useRouter()

const playerCount = ref(4)
const playerNames = ref<string[]>(['', '', '', ''])

const updatePlayerCount = () => {
  playerNames.value =
    playerCount.value === 4
      ? ['', '', '', '']
      : ['', '', '', '', '']
}

const canStart = computed(() =>
  playerNames.value.every(name => name.trim().length > 0)
)

const startGame = () => {
  gameStore.startGame(playerNames.value)
  router.push('/game')
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center p-4 bg-gray-50">
    <div class="w-full max-w-md space-y-6">
      <h1 class="text-2xl font-bold text-center text-black">Remi Box Score</h1>

      <div>
        <label class="block font-medium mb-1 text-black">Jumlah Pemain</label>
        <select
          v-model="playerCount"
          @change="updatePlayerCount"
          class="w-full border rounded p-2 text-black"
        >
          <option :value="4">4 Pemain</option>
          <option :value="5">5 Pemain</option>
        </select>
      </div>

      <div class="space-y-2 text-gray-800">
        <div
          v-for="(name, index) in playerNames"
          :key="index"
        >
          <input
            v-model="playerNames[index]"
            type="text"
            placeholder="Nama Pemain"
            class="w-full border rounded p-2"
          />
        </div>
      </div>

      <button
        :disabled="!canStart"
        @click="startGame"
        class="w-full bg-black text-white py-2 rounded disabled:opacity-40"
      >
        Mulai Game
      </button>
    </div>
  </div>
</template>