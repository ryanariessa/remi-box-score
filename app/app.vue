<script setup lang="ts">
import { useGameStore } from '~/stores/game'

const gameStore = useGameStore()
gameStore.init()
</script>

<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<style lang="scss" scoped>

</style>