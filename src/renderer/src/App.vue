<template>
  <div class="h-full p-8">
    <div v-if="authStore.isAuthorizing">authorizing....</div>
    <router-view v-if="!authStore.isAuthorizing" />
    {{ authStore.authData }}
  </div>
</template>
<script lang="ts" setup>
import { useAuthStore } from './stores/auth'

const authStore = useAuthStore()
</script>
