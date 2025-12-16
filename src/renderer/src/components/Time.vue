<template>
  <div>
    <div class="flex gap-0.5 items-center justify-center text-2xl">
      <div>{{ display(hh) }}</div>
      <div class="text-sm" :class="separatorClass">:</div>
      <div>{{ display(mm) }}</div>
      <div class="text-sm" :class="separatorClass">:</div>
      <div>{{ display(ss) }}</div>
    </div>
    <div v-if="label" class="text-center text-sm uppercase text-primary-500">{{ label }}</div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  seconds: number
  darkMode: boolean
  label?: string
}>()

const separatorClass = computed(() => (props.darkMode ? 'text-orange-600' : 'text-orange-700'))

const hh = computed(() => Math.floor(props.seconds / 3600))
const mm = computed(() => Math.floor((props.seconds - hh.value * 3600) / 60))
const ss = computed(() => Math.floor(props.seconds - hh.value * 3600 - mm.value * 60))

const display = (value: number) => value.toString().padStart(2, '0')
</script>
