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
        class="flex justify-between items-center p-2 rounded transition"
        :class="{
          /* 🏆 PEMENANG */
          'bg-green-100 text-green-900 dark:bg-green-900/30 dark:text-green-300':
            row.total === highest,

          /* ☠️ TERENDAH */
          'bg-red-100 text-red-900 dark:bg-red-900/30 dark:text-red-300':
            row.total === lowest,

          /* NORMAL */
          'bg-gray-100 text-gray-900 dark:bg-zinc-800 dark:text-gray-100':
            row.total !== highest && row.total !== lowest
        }"
      >
        <!-- KIRI -->
        <div class="flex items-center gap-2">
          <span class="font-bold">{{ index + 1 }}.</span>
          <span class="truncate">{{ row.player.name }}</span>

          <span
            v-if="row.total === highest"
            class="text-xs font-semibold text-green-700 dark:text-green-300"
          >
            🏆
          </span>

          <span
            v-if="row.total === lowest"
            class="text-xs font-semibold text-red-700 dark:text-red-300"
          >
            ☠️
          </span>
        </div>

        <!-- KANAN -->
        <div class="text-right">
          <div class="font-bold text-lg">
            {{ row.total }}
          </div>
          <div class="text-xs text-gray-500 dark:text-gray-400">
            Sesi terakhir: {{ row.lastScore }}
          </div>
        </div>
      </li>
    </ol>
  </section>
</template>