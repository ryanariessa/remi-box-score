<script setup lang="ts">
import { computed } from 'vue'
import { useGameStore } from '~/stores/game'

const gameStore = useGameStore()

const ranking = computed(() => gameStore.ranking)

const highest = computed(() => ranking.value[0]?.total ?? null)
const lowest = computed(() => ranking.value.at(-1)?.total ?? null)
</script>

<template>
  <section class="space-y-2">

    <ol class="space-y-1">
      <li
        v-for="(row, index) in ranking"
        :key="row.player.id"
        class="flex justify-between items-center p-2 rounded"
        :class="{
          'bg-green-300 text-gray-950': row.total === highest,
          'bg-red-300 text-gray-950': row.total === lowest
        }"
      >
        <div class="flex items-center gap-2">
          <span class="font-bold">{{ index + 1 }}.</span>
          <span>{{ row.player.name }}</span>

          <span
            v-if="row.total === highest"
            class="text-green-600 text-xs font-semibold"
          >
            🏆
          </span>

          <span
            v-if="row.total === lowest"
            class="text-red-600 text-xs font-semibold"
          >
            Kalah
          </span>
        </div>

        <div class="text-right">
          <div class="font-bold text-lg">{{ row.total }}</div>
          <div class="text-gray-500">
            Sesi terakhir: {{ row.lastScore }}
          </div>
        </div>
      </li>
    </ol>
  </section>
</template>