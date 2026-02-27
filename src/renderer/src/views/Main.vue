<template>
  <router-view />
</template>
<script lang="ts" setup>
// STORES
import { useAppStore } from '@renderer/stores/app'

const appStore = useAppStore()

appStore.fetchData()
</script>
