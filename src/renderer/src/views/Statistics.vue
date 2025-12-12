<template>
  <div v-if="!appStore.isFetching" class="flex flex-col gap-4">
    <Card>
      <template #subtitle>
        <span class="uppercase">Suspensions usage</span>
      </template>
      <template #content> asdasds </template>
    </Card>

    <div class="grid grid-cols-3 gap-4">
      <Card>
        <template #content>
          <Time :seconds="appStore.totalTime" label="Total Time" />
        </template>
      </Card>
      <Card>
        <template #content>
          <Distance :distance="appStore.totalDistance" label="Total Kilometers" />
        </template>
      </Card>
      <Card>
        <template #content>
          <Elevation :elevation="appStore.maxElevation" label="Highest +Elevation" />
        </template>
      </Card>

      <Card>
        <template #content>
          <Time :seconds="appStore.avgTime" label="Average Time" />
        </template>
      </Card>
      <Card>
        <template #content>
          <Distance :distance="appStore.avgDistance" label="Average Kilometers" />
        </template>
      </Card>
      <Card>
        <template #content>
          <Elevation :elevation="appStore.avgElevation" label="Average +Elevation" />
        </template>
      </Card>
    </div>
  </div>
</template>
<script lang="ts" setup>
import Card from 'primevue/card'
import { useAppStore } from '../stores/app'

import Time from '../components/Time.vue'
import Distance from '../components/Distance.vue'
import Elevation from '../components/Elevation.vue'
const appStore = useAppStore()
</script>
