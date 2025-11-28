<template>
  <div class="h-full flex flex-col grow items-center justify-center">
    <Message severity="error" icon="pi pi-times-circle" class="py-8 px-16">
      <div class="text-2xl">Page not found</div>
    </Message>
  </div>
</template>
<script lang="ts" setup>
import { Message } from 'primevue'
</script>
