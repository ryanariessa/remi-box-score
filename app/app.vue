<script setup lang="ts">
import { useGameStore } from '~/stores/game'

const gameStore = useGameStore()
gameStore.init()
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>