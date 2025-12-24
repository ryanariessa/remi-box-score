<script setup lang="ts">
import { Sun, Moon, Laptop } from 'lucide-vue-next'

const colorMode = useColorMode()

const modes = [
    { key: 'system', icon: Laptop, label: 'System' },
    { key: 'light', icon: Sun, label: 'Light' },
    { key: 'dark', icon: Moon, label: 'Dark' }
]

const current = computed(() =>
    modes.find(m => m.key === colorMode.preference) ?? modes[0]
)

const nextMode = () => {
    const index = modes.findIndex(m => m.key === colorMode.preference)
    const nextIndex = (index + 1) % modes.length
    colorMode.preference = modes[nextIndex]?.key ?? 'system'
}
</script>

<template>
    <button @click="nextMode" class="flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition
           hover:scale-[1.03] active:scale-95" :class="{
            'bg-white text-black border-gray-300': colorMode.preference === 'light',
            'bg-gray-900 text-white border-gray-700': colorMode.preference === 'dark',
            'bg-zinc-200 text-black border-zinc-400 dark:bg-zinc-800 dark:text-white':
                colorMode.preference === 'system'
        }">
        <component :is="current?.icon" class="w-4 h-4" />
        <span class="hidden sm:inline">
            {{ current?.label }}
        </span>
    </button>
</template>