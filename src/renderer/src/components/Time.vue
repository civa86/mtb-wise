<template>
  <div class="flex gap-1 items-center justify-center">
    <div>{{ display(hh) }}</div>
    <div>:</div>
    <div>{{ display(mm) }}</div>
    <div>:</div>
    <div>{{ display(ss) }}</div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  seconds: number
}>()

const hh = computed(() => Math.floor(props.seconds / 3600))
const mm = computed(() => Math.floor((props.seconds - hh.value * 3600) / 60))
const ss = computed(() => Math.floor(props.seconds - hh.value * 3600 - mm.value * 60))

const display = (value: number) => value.toString().padStart(2, '0')
</script>
