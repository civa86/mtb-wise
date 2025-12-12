<template>
  <div class="flex gap-0.5 items-baseline justify-center text-2xl">
    <div>{{ elev }}</div>
    <div class="text-xs" :class="separatorClass">m</div>
  </div>
  <div v-if="label" class="text-center text-sm uppercase text-primary-500">{{ label }}</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAppStore } from '../stores/app'

const appStore = useAppStore()

const props = defineProps<{
  elevation: number
  label?: string
}>()

const separatorClass = computed(() => (appStore.darkMode ? 'text-orange-500' : 'text-orange-700'))

const elev = Math.round(props.elevation)
</script>
