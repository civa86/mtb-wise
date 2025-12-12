<template>
  <div v-if="!appStore.isFetching" class="grid grid-cols-4 gap-4">
    <Card>
      <!-- <template #title>Time in Bike</template> -->
      <template #content>
        <Time :seconds="appStore.totalTime" />
        <!-- <div>{{ secondsToTime(appStore.avgTime) }}</div> -->
      </template>
    </Card>

    <div>{{ distkm(appStore.totalDistance) }}</div>
    <div>{{ distkm(appStore.avgDistance) }}</div>
    <div>asdsada</div>
    <div>{{ Math.round(appStore.avgElevation) }}</div>
  </div>
</template>
<script lang="ts" setup>
import Card from 'primevue/card'
import { useAppStore } from '../stores/app'

import Time from '../components/Time.vue'

const appStore = useAppStore()

const distkm = (distance: number) => (distance / 1000).toFixed(2)
</script>
