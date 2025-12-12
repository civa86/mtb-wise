<template>
  <router-view />
</template>
<script lang="ts" setup>
import { useAppStore } from '../stores/app'

const appStore = useAppStore()

appStore.fetchData()
</script>
