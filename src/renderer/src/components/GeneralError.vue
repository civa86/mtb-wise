<template>
  <Message severity="error">
    <div class="flex flex-col items-center justify-center">
      <div class="flex gap-4 items-center justify-center p-12 text-2xl">
        <i class="pi pi-exclamation-triangle" style="font-size: 2.5rem" />
        <span>Something went wrong!</span>
      </div>
      <Button class="w-1/2 mb-4" severity="danger" label="Reload" @click="emit('reload')" />
    </div>
  </Message>
</template>

<script setup lang="ts">
import { Message, Button } from 'primevue'

const emit = defineEmits(['reload'])
</script>
