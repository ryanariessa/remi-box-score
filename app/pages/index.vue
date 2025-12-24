<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useGameStore } from '~/stores/game'
import { useRouter } from 'vue-router'

definePageMeta({
  middleware: ['index-guard']
})

const gameStore = useGameStore()
const router = useRouter()

/* ===== STATE ===== */
const playerNames = ref<string[]>(['', '', '', ''])
const errors = ref<Record<number, string | null>>({})
const touched = ref<boolean[]>([false, false, false, false])

/* ===== ACTIONS ===== */
const addPlayerAfter = (index: number) => {
  if (playerNames.value.length >= 5) return
  playerNames.value.splice(index + 1, 0, '')
  touched.value.splice(index + 1, 0, false)
}

const removePlayer = (index: number) => {
  if (playerNames.value.length <= 4) return
  playerNames.value.splice(index, 1)
  touched.value.splice(index, 1)
}

/* ===== VALIDATION ===== */
const validate = () => {
  const map: Record<number, string | null> = {}
  const normalized = playerNames.value.map(n => n.trim().toLowerCase())

  playerNames.value.forEach((name, index) => {
    if (!touched.value[index]) {
      map[index] = null
      return
    }

    if (!name.trim()) {
      map[index] = 'Nama pemain wajib diisi'
      return
    }

    const duplicate =
      normalized.filter(n => n === normalized[index]).length > 1

    if (duplicate) {
      map[index] = 'Nama pemain tidak boleh sama'
      return
    }

    map[index] = null
  })

  errors.value = map
}

watch(playerNames, validate, { deep: true })

/* ===== COMPUTED ===== */
const canStart = computed(() =>
  playerNames.value.length >= 4 &&
  playerNames.value.length <= 5 &&
  Object.values(errors.value).every(v => v === null) &&
  playerNames.value.every(name => name.trim())
)

/* ===== START ===== */
const startGame = () => {
  if (!canStart.value) return
  gameStore.startGame(playerNames.value)
  router.push('/game')
}
</script>

<template>
  <div class="flex items-center justify-center p-4">
    <div class="w-full max-w-md space-y-6 bg-card p-6 rounded-xl shadow">

      <h1 class="text-2xl font-bold text-center">
        Remi Box Score
      </h1>

      <!-- INPUT PEMAIN -->
      <transition-group name="list" tag="div" class="space-y-3">
        <div v-for="(name, index) in playerNames" :key="index" class="space-y-1">
          <div class="flex items-center gap-2">
            <input
              v-model="playerNames[index]"
              @input="touched[index] = true"
              type="text"
              placeholder="Nama Pemain"
              :class="[
                'flex-1 rounded p-2 transition border bg-background',
                errors[index]
                  ? 'border-destructive animate-shake'
                  : 'border-input focus:border-ring'
              ]"
            />

            <!-- ➕ TAMBAH -->
            <button
              v-if="playerNames.length < 5"
              @click="addPlayerAfter(index)"
              class="px-3 py-2 rounded bg-primary text-primary-foreground"
            >
              +
            </button>

            <!-- 🗑 HAPUS -->
            <button
              v-else
              @click="removePlayer(index)"
              class="px-3 py-2 rounded bg-destructive text-destructive-foreground"
            >
              ×
            </button>
          </div>

          <p v-if="errors[index]" class="text-xs text-destructive">
            {{ errors[index] }}
          </p>
        </div>
      </transition-group>

      <!-- START -->
      <button
        :disabled="!canStart"
        @click="startGame"
        class="w-full py-2 rounded font-semibold
               bg-primary text-primary-foreground
               disabled:opacity-40 transition"
      >
        Mulai Game
      </button>

      <p class="text-xs text-center text-muted-foreground">
        Minimal 4 pemain, maksimal 5 pemain
      </p>
    </div>
  </div>
</template>

<style scoped>
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

.list-enter-active,
.list-leave-active {
  transition: all 0.25s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>