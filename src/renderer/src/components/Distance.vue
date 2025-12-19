<template>
  <div>
    <div class="flex gap-0.5 items-baseline justify-center text-2xl">
      <div>{{ km }}</div>
      <div class="text-sm text-orange-700 dark:text-orange-600">.</div>
      <div class="text-sm">{{ m }}</div>
    </div>
    <div v-if="label" class="text-center text-sm uppercase text-primary-500">{{ label }}</div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  distance: number
  label?: string
}>()

const [km, m] = (props.distance / 1000).toFixed(2).split('.')
</script>
