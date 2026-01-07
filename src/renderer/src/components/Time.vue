<template>
  <div>
    <div class="flex gap-0.5 items-center justify-center text-2xl">
      <div>{{ display(hh) }}</div>
      <div class="text-sm text-orange-700 dark:text-orange-600">:</div>
      <div>{{ display(mm) }}</div>
      <div class="text-sm text-orange-700 dark:text-orange-600">:</div>
      <div>{{ display(ss) }}</div>
    </div>
    <div v-if="label" class="text-center text-sm uppercase text-primary-500">{{ label }}</div>
  </div>
</template>

<script setup lang="ts">
// UTILS
import { secondsToHHMMSS } from '@renderer/utils'

const props = defineProps<{
  seconds: number
  label?: string
}>()

const [hh, mm, ss] = secondsToHHMMSS(props.seconds)
const display = (value: number) => value.toString().padStart(2, '0')
</script>
